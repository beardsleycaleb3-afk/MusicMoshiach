// js/orchestrator.js
// WHAT DOES IT DO? Coordinates all modules into a single coherent running system
// WHAT DOES IT OWN? Global initialization sequence and main loop timing
// WHAT DOES IT NEED? All other modules
// WHAT DOES IT INPUT? First user gesture
// WHAT DOES IT OUTPUT? A fully running visualizer
// WHAT DOES IT CONNECT TO? Audio, Visual, UI, Input
// WHAT DOES IT HELP? Makes the entire app feel like one living entity
// WHAT DOES IT RETURN? Nothing (side effects)
// WHAT DOES IT START? AudioContext, Three.js scene, render loop on first tap
// WHAT DOES IT FINISH? Graceful shutdown on page unload

import { Audio } from './audio.js';
import { Visual } from './visual.js';
import { UI } from './ui.js';
import { Input } from './input.js';
import { State } from './utils.js';

export const Orchestrator = {
  init() {
    // WHAT DOES IT START? The entire application
    document.body.addEventListener('pointerdown', () => {
      if (State.started) return;
      Audio.init();
      Visual.init();
      UI.buildPlaylist();
      State.started = true;
      Audio.loadTrack(0);
    }, { once: true });
  },

  shutdown() {
    // WHAT DOES IT FINISH? Cleanup when needed
    if (Audio.ctx) Audio.ctx.close();
  }
};

// WHAT DOES IT REGISTER? Service Worker (kept as requested)
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
