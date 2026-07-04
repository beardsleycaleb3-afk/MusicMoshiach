// js/utils.js
// WHAT DOES IT DO? Provides shared constants, helpers, and state for the entire system
// WHAT DOES IT OWN? CONSTS, State, Vector3 helpers
// WHAT DOES IT NEED? Nothing
// WHAT DOES IT INPUT? Nothing
// WHAT DOES IT OUTPUT? Constants and utilities
// WHAT DOES IT CONNECT TO? All other modules
// WHAT DOES IT HELP? Keeps the system coherent and DRY
// WHAT DOES IT RETURN? Utility objects
// WHAT DOES IT START? Nothing
// WHAT DOES IT FINISH? Nothing

export const CONSTS = {
  TRANSITION_INTERVAL: 2800,
  MAX_PARTICLES: 180,
  LAYER_OPACITIES: [0.5, 0.6, 0.7, 0.8, 0.9],
  ORBIT_SPEED: 0.022,
  GRAVITY_PULL: 0.0011,
  FFT_SIZE: 256
};

export const State = {
  started: false,
  trackIndex: 0,
  visualMode: 0,
  hue: 30,
  beatEnergy: 0,
  lastBeatAt: 0,
  lastVisualTransition: 0,
  queue: [],
  bgIndex: 0,
  coreIndex: 0
};

export const VectorHelpers = {
  lerp(a, b, t) { return a + (b - a) * t; },
  mirrored(v) { return { x: -v.x, y: v.y, z: v.z }; }
};
