// js/audio-preanalysis.js
// WHAT DOES IT DO? Runs a real offline FFT pass over a track BEFORE/while it
// plays, producing a time-indexed schedule of {bass,mid,high,intensity} plus
// a beat list and BPM — so the visuals can be driven by what the song
// actually IS, not just live threshold-guessing off getByteFrequencyData().
// WHAT DOES IT OWN? A Map cache keyed by filename. Nothing else persists.
// WHAT DOES IT NEED? Nothing from the page except a filename under
// assets/audio/. No DOM access, no dependency on AudioLayer.
// WHAT DOES IT INPUT? A filename (e.g. "12.mp3").
// WHAT DOES IT OUTPUT? { hopSeconds, frames, beats, bpm } cached per file.
// WHAT DOES IT CONNECT TO? Loaded as a plain global (window.AudioPreAnalyzer)
// so the existing classic <script> block can call it directly — no module
// conversion of the 744-line live file required.
// WHAT DOES IT HELP? Replaces the filename-hash fake "personality" system
// (fingerprint()) with numbers actually derived from the audio.
// WHAT DOES IT RETURN? frameAt() returns a lerped {bass,mid,high,intensity}
// for any playback position, matching the live parse()'s band ranges exactly
// (bins 0-8 bass, 8-40 mid, 40-128 high, at fftSize 256 / 128 bins) so it's
// a true drop-in — no downstream tuning constants need to change.
// WHAT DOES IT START? analyze() kicks off decode + offline render.
// WHAT DOES IT FINISH? Caches the result; repeat calls for the same file
// return instantly.

window.AudioPreAnalyzer = (function () {
  const cache = new Map();     // filename -> { hopSeconds, frames, beats, bpm }
  const pending = new Map();   // filename -> in-flight Promise

  const FFT_SIZE = 256;        // matches AudioLayer.analyser.fftSize exactly
  const HOP_SECONDS = 0.05;    // 20 samples/sec — fine enough for beat timing,
                                // coarse enough to stay memory-safe on 3GB RAM
  const BEAT_BASS_THRESHOLD = 0.45; // matches live detectBeat() threshold
  const BEAT_MIN_GAP_MS = 140;      // matches live detectBeat() min gap

  function bandsFromBins(bins) {
    let bass = 0, mid = 0, high = 0;
    for (let i = 0; i < 8; i++) bass += bins[i];
    for (let i = 8; i < 40; i++) mid += bins[i];
    for (let i = 40; i < 128; i++) high += bins[i];
    bass /= (8 * 255);
    mid /= (32 * 255);
    high /= (88 * 255);
    return { bass, mid, high, intensity: bass * 0.5 + mid * 0.35 + high * 0.15 };
  }

  async function renderFrames(audioBuffer) {
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    const analyser = offlineCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    source.connect(analyser);
    analyser.connect(offlineCtx.destination); // must reach destination or offline rendering won't process it
    source.start(0);

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const frames = [];
    const duration = audioBuffer.duration;

    // suspend/resume scheduling: OfflineAudioContext.suspend(t) pauses
    // rendering exactly at time t, we read the analyser, then resume — this
    // is what makes true offline FFT sampling possible without real-time playback
    let t = HOP_SECONDS;
    const scheduleAll = async () => {
      while (t < duration) {
        const suspendAt = t;
        await offlineCtx.suspend(suspendAt);
        analyser.getByteFrequencyData(freqData);
        frames.push({ t: suspendAt, ...bandsFromBins(freqData) });
        offlineCtx.resume();
        t += HOP_SECONDS;
      }
    };

    const renderDone = offlineCtx.startRendering();
    await scheduleAll();
    await renderDone;
    return frames;
  }

  function extractBeats(frames) {
    const beats = [];
    const intervals = [];
    let lastBeatMs = -Infinity;
    for (const f of frames) {
      const nowMs = f.t * 1000;
      if (f.bass > BEAT_BASS_THRESHOLD && nowMs - lastBeatMs > BEAT_MIN_GAP_MS) {
        if (lastBeatMs > -Infinity) intervals.push(nowMs - lastBeatMs);
        beats.push(f.t);
        lastBeatMs = nowMs;
      }
    }
    let bpm = 0;
    if (intervals.length >= 3) {
      const sorted = intervals.slice().sort((a, b) => a - b);
      const medianMs = sorted[Math.floor(sorted.length / 2)];
      bpm = medianMs > 0 ? Math.round(60000 / medianMs) : 0;
    }
    return { beats, bpm };
  }

  async function analyze(filename) {
    if (cache.has(filename)) return cache.get(filename);
    if (pending.has(filename)) return pending.get(filename);

    const promise = (async () => {
      try {
        const res = await fetch(`assets/audio/${filename}`);
        const arrayBuffer = await res.arrayBuffer();
        const decodeCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
        decodeCtx.close();

        const frames = await renderFrames(audioBuffer);
        const { beats, bpm } = extractBeats(frames);

        // whole-track character, derived from real audio — this is what
        // should replace the filename-hash songEnergy/songChaos fingerprint
        let sumIntensity = 0, sumBassSq = 0, meanBass = 0;
        for (const f of frames) { sumIntensity += f.intensity; meanBass += f.bass; }
        meanBass /= frames.length || 1;
        for (const f of frames) sumBassSq += (f.bass - meanBass) ** 2;
        const songEnergy = frames.length ? sumIntensity / frames.length : 0.3;
        const songChaos = frames.length ? Math.min(1, Math.sqrt(sumBassSq / frames.length) * 3) : 0.2;

        const result = { hopSeconds: HOP_SECONDS, frames, beats, bpm, songEnergy, songChaos, duration: audioBuffer.duration };
        cache.set(filename, result);
        return result;
      } finally {
        pending.delete(filename);
      }
    })();

    pending.set(filename, promise);
    return promise;
  }

  function get(filename) {
    return cache.get(filename) || null;
  }

  // lerped lookup so visuals don't step discretely between 50ms samples
  function frameAt(filename, t) {
    const data = cache.get(filename);
    if (!data || !data.frames.length) return null;
    const idx = t / data.hopSeconds;
    const i0 = Math.max(0, Math.min(data.frames.length - 1, Math.floor(idx)));
    const i1 = Math.min(data.frames.length - 1, i0 + 1);
    const frac = idx - i0;
    const a = data.frames[i0], b = data.frames[i1];
    return {
      bass: a.bass + (b.bass - a.bass) * frac,
      mid: a.mid + (b.mid - a.mid) * frac,
      high: a.high + (b.high - a.high) * frac,
      intensity: a.intensity + (b.intensity - a.intensity) * frac
    };
  }

  // walks the cached beat schedule against playback position; cursor is a
  // {i:0} object the caller keeps per-track so this stays a pure function
  function beatDueAt(filename, t, cursor) {
    const data = cache.get(filename);
    if (!data) return false;
    if (cursor.i < data.beats.length && data.beats[cursor.i] <= t) {
      cursor.i++;
      return true;
    }
    return false;
  }

  return { analyze, get, frameAt, beatDueAt };
})();
