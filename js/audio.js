// js/audio.js
// WHAT DOES IT DO? Manages audio playback, real-time frequency analysis, and beat detection
// WHAT DOES IT OWN? Audio element, AudioContext, AnalyserNode, frequency data array
// WHAT DOES IT NEED? User gesture to unlock AudioContext
// WHAT DOES IT INPUT? Track index, volume changes, play/pause commands
// WHAT DOES IT OUTPUT? Intensity, mids, highs, beat events
// WHAT DOES IT CONNECT TO? Orchestrator and Visual layer
// WHAT DOES IT HELP? Provides the reactive heartbeat for all visuals
// WHAT DOES IT RETURN? Analysis values on demand
// WHAT DOES IT START? AudioContext and MediaElementSource on first user interaction
// WHAT DOES IT FINISH? Continuous frequency updates in the main loop

import { State } from './utils.js';

export const Audio = {
  audio: new Audio(),
  ctx: null,
  analyzer: null,
  data: new Uint8Array(256),

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyzer = this.ctx.createAnalyser();
    this.analyzer.fftSize = 256;
    this.analyzer.smoothingTimeConstant = 0.82;
    this.source = this.ctx.createMediaElementSource(this.audio);
    this.source.connect(this.analyzer);
    this.analyzer.connect(this.ctx.destination);
    this.audio.crossOrigin = "anonymous";
    this.audio.volume = 1;
  },

  ensureRunning() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  getBins() {
    if (!this.analyzer) return this.data;
    this.analyzer.getByteFrequencyData(this.data);
    return this.data;
  },

  getIntensity() {
    const bins = this.getBins();
    let sum = 0;
    for (let i = 0; i < 24; i++) sum += bins[i];
    return Math.min(1, sum / (24 * 255));
  },

  getMids() {
    const bins = this.getBins();
    let sum = 0;
    for (let i = 24; i < 72; i++) sum += bins[i];
    return Math.min(1, sum / (48 * 255));
  },

  getHighs() {
    const bins = this.getBins();
    let sum = 0;
    for (let i = 72; i < 256; i++) sum += bins[i];
    return Math.min(1, sum / (184 * 255));
  },

  detectBeat() {
    const bins = this.getBins();
    let bass = 0;
    for (let i = 0; i < 8; i++) bass += bins[i];
    bass = bass / (8 * 255);
    const now = performance.now();
    const hit = bass > 0.42 && (now - State.lastBeatAt) > 180;
    if (hit) {
      State.lastBeatAt = now;
      State.queue.push({ type: 'beat', at: now, strength: bass });
      State.beatEnergy = bass;
    }
    return hit ? bass : 0;
  },

  loadTrack(index) {
    State.trackIndex = index % playlist.length;
    const t = playlist[State.trackIndex];
    this.audio.src = `assets/audio/${t}`;
    document.getElementById('track-info').innerText = songTitles[t] || t;
    Visual.updateAssets(State.trackIndex);
    this.audio.play().catch(() => {});
    this.ensureRunning();
  },

  toggle(e) {
    if (e) e.stopPropagation();
    this.audio.paused ? this.audio.play().catch(() => {}) : this.audio.pause();
    this.ensureRunning();
  },

  setVolume(v) {
    this.audio.volume = Number(v);
  }
};
