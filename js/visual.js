// js/visual.js
// WHAT DOES IT DO? Renders all 3D layered fading spheres (50-90% opacity), background, orbiting twin, glyph particles
// WHAT DOES IT OWN? Three.js scene, renderer, camera, core layers, particle systems
// WHAT DOES IT NEED? GlyphPoints, Audio analysis values
// WHAT DOES IT INPUT? Intensity, mids, highs, beat events
// WHAT DOES IT OUTPUT? Real-time rendered visuals with fading copies
// WHAT DOES IT CONNECT TO? Audio, GlyphPoints, Orchestrator
// WHAT DOES IT HELP? Creates the stunning, reactive, multi-layered sphere system
// WHAT DOES IT RETURN? Nothing (side effects on canvas)
// WHAT DOES IT START? Three.js scene and render loop
// WHAT DOES IT FINISH? Continuous animation frame

import { GlyphPoints } from './glyphpoints.js';
import { Audio } from './audio.js';
import { State } from './utils.js';

export const Visual = {
  scene: null,
  renderer: null,
  camera: null,
  texLoader: new THREE.TextureLoader(),
  textureCache: new Map(),
  coreLayers: [],
  bgPlane: null,
  miniTwin: null,
  particleGroup: null,

  init() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    document.getElementById('canvas-container').appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(48, (window.innerWidth - 20) / (window.innerHeight - 205), 0.1, 300);
    this.camera.position.z = 9;

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x111111));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(6, 10, 12);
    this.scene.add(key);

    // Layered fading spheres (50% to 90% opacity with scaling)
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.IcosahedronGeometry(1.9 - i * 0.22, 5);
      const mat = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: [0.5, 0.6, 0.7, 0.8, 0.9][i],
        shininess: 90,
        specular: 0xaaaaaa,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.basePositions = new Float32Array(geo.attributes.position.array);
      mesh.userData.layer = i;
      this.scene.add(mesh);
      this.coreLayers.push(mesh);
    }

    this.bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(22, 15), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.75, side: THREE.DoubleSide }));
    this.bgPlane.position.z = -6;
    this.scene.add(this.bgPlane);

    this.miniTwin = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 48), new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.65, emissive: 0x7733ff }));
    this.scene.add(this.miniTwin);

    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    this.resize();
    this.loop();
  },

  updateLayeredCores(intensity, mids, highs) {
    const time = performance.now() * 0.0012;
    this.coreLayers.forEach((layer, idx) => {
      const positions = layer.geometry.attributes.position;
      const base = layer.userData.basePositions;
      for (let i = 0; i < positions.count; i++) {
        const ix = i * 3;
        const nx = positions.getX(i) * 0.8;
        const ny = positions.getY(i) * 0.8;
        const nz = positions.getZ(i) * 0.8;
        const wave = Math.sin(time * (2.8 + idx) + i * 0.12) * 0.11;
        const swell = intensity * 1.2 + mids * 0.6 + highs * 0.4;
        const dist = swell * (1.1 - idx * 0.2) + wave;
        positions.setXYZ(i, base[ix] + nx * dist, base[ix + 1] + ny * dist, base[ix + 2] + nz * dist);
      }
      positions.needsUpdate = true;
      layer.geometry.computeVertexNormals();
      layer.rotation.y += 0.0035 + intensity * 0.012;
      layer.position.y = Math.sin(time * 1.1) * (0.08 + intensity * 0.15);
      layer.scale.setScalar(1 + intensity * 0.35);
    });
  },

  updateAssets(idx) {
    const cp = `assets/audio/core/${coreFiles[idx % coreFiles.length]}`;
    const bp = `assets/audio/bg/${bgs[idx % bgs.length]}`;
    document.getElementById('bg-container').style.backgroundImage = `url('${bp}')`;
    if (this.coreLayers[0]) this.coreLayers[0].material.map = this.texLoader.load(cp);
  },

  resize() {
    const w = window.innerWidth - 20;
    const h = window.innerHeight - 205;
    if (this.renderer) this.renderer.setSize(w, h);
    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  },

  cycleMode(e) {
    if (e) e.stopPropagation();
    State.visualMode = (State.visualMode + 1) % 4;
    document.getElementById('mode-label').innerText = `Mode: ${['liquid','spiky','ripple','warp'][State.visualMode]}`;
  },

  loop() {
    requestAnimationFrame(() => this.loop());
    const intensity = Audio.getIntensity();
    const mids = Audio.getMids();
    const highs = Audio.getHighs();
    Audio.detectBeat();
    this.updateLayeredCores(intensity, mids, highs);
    if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
  }
};
