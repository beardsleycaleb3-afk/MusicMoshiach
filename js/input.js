// js/input.js
// WHAT DOES IT DO? Handles all user input, gestures, skip, and initialization trigger
// WHAT DOES IT OWN? Pointer event handling logic
// WHAT DOES IT NEED? Audio and Visual modules
// WHAT DOES IT INPUT? Pointer/touch events
// WHAT DOES IT OUTPUT? Commands to other layers
// WHAT DOES IT CONNECT TO? Audio, Visual, Orchestrator
// WHAT DOES IT HELP? Makes the app responsive to mobile touch
// WHAT DOES IT RETURN? Nothing (event side effects)
// WHAT DOES IT START? App initialization on first tap
// WHAT DOES IT FINISH? Nothing

import { Audio } from './audio.js';
import { State } from './utils.js';

export const Input = {
  handle(e) {
    if (e.target.closest('#hud') || e.target.closest('#playlist-screen')) return;
    if (!State.started) {
      Audio.init();
      Visual.init();
      UI.buildPlaylist();
      State.started = true;
      Audio.loadTrack(0);
    } else {
      Audio.ensureRunning();
    }
  },

  skip(n, e) {
    if (e) e.stopPropagation();
    if (!State.started) return;
    State.trackIndex = (State.trackIndex + n + playlist.length) % playlist.length;
    Audio.loadTrack(State.trackIndex);
  }
};
