// js/visual.js
// WHAT DOES IT DO? Renders all 3D layered fading spheres (50-90% opacity), background plane, orbiting twin, glyph particles, and reactive geometry
// WHAT DOES IT OWN? Three.js scene, renderer, camera, core layers, particle systems, texture cache
// WHAT DOES IT NEED? GlyphPoints, Audio analysis, full asset paths
// WHAT DOES IT INPUT? Intensity, mids, highs, beat events, track index
// WHAT DOES IT OUTPUT? Real-time rendered visuals with fading layered spheres and background eating effect
// WHAT DOES IT CONNECT TO? Audio, GlyphPoints, Orchestrator
// WHAT DOES IT HELP? Creates the stunning, multi-opacity, reactive sphere system with your assets
// WHAT DOES IT RETURN? Nothing (side effects on canvas)
// WHAT DOES IT START? Three.js scene, render loop, asset loading
// WHAT DOES IT FINISH? Continuous animation frame with graceful fallback

import { GlyphPoints } from './glyphpoints.js';
import { Audio } from './audio.js';
import { State } from './utils.js';

// Full asset lists (no placeholders)
const coreFiles = ['a.jpeg','aa.jpeg','aaa.jpeg','b.jpeg','bb.jpeg','bbb.jpeg','c.jpeg','cc.jpeg','ccc.jpeg','d.jpeg','dd.jpeg','ddd.jpeg','e.jpeg','ee.jpeg','eee.jpeg','f.jpeg','ff.jpeg','fff.jpeg','g.jpeg','gg.jpeg','ggg.jpeg','h.jpeg','hh.jpeg','i.jpeg','ii.jpeg','iii.jpeg','j.jpeg','jj.jpeg','jjj.jpeg','k.jpeg','kk.jpeg','kkk.jpeg','l.jpeg','ll.jpeg','lll.jpeg','m.jpeg','mm.jpeg','mmm.jpeg','n.jpeg','nn.jpeg','o.jpeg','oo.jpeg','p.jpeg','pp.jpeg','q.jpeg','qq.jpeg','r.jpeg','rr.jpeg','s.jpeg','ss.jpeg','t.jpeg','tt.jpeg','u.jpeg','uu.jpeg','v.jpeg','vv.jpeg','w.jpeg','x.jpeg','xx.jpeg','y.jpeg','yy.jpeg','z.jpeg','zz.jpeg'];

const bgs = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg','13.jpg','14.jpg','15.jpg','16.jpg','17.jpg','18.jpg','19.jpg','20.jpg','21.jpg','22.jpg','23.jpg','24.jpg','25.jpg','26.jpg','27.jpg','28.jpg','29.jpg','30.jpg','31.jpg','32.jpg','33.jpg','34.jpg','35.jpg','36.jpg','37.jpg','38.jpg','40.jpg','41.jpg','42.jpg','43.jpg','44.jpg','45.jpg','46.jpg','47.jpg','48.jpg','49.jpg','50.jpg','51.jpg','52.jpg','54.jpg','55.jpg','56.jpg','57.jpg','59.jpg','60.jpg','61.jpg','62.jpg','63.jpg','64.jpg','65.jpg'];

const playlist = ["9.mp3","10.mp3","11.mp3","12.mp3","13.mp3","14.mp3","15.mp3","16.mp3","17.mp3","18.mp3","19.mp3","20.mp3","21.mp3","22.mp3","23.mp3","24.mp3","25.mp3","26.mp3","27.mp3","28.mp3","29.mp3","30.mp3","31.mp3","32.mp3","33.mp3","34.mp3","35.mp3","38.mp3","39.mp3","40.mp3","41.mp3","42.mp3","43.mp3","44.mp3","45.mp3","46.mp3","47.mp3","48.mp3","49.mp3","50.mp3","51.mp3","52.mp3","53.mp3","55.mp3","56.mp3","57.mp3","58.mp3","59.mp3","60.mp3","1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"];

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

    // Background with fallback
    const bgEl = document.getElementById('bg-container');
    const bgImg = new Image();
    bgImg.onerror = () => {
      bgEl.style.backgroundImage = 'none';
      bgEl.style.backgroundColor = '#110022';
    };
    bgImg.onload = () => bgEl.style.backgroundImage = `url('${bp}')`;
    bgImg.src = bp;

    // Core textures with fallback to procedural color
    if (this.coreLayers.length > 0) {
      const tex = this.texLoader.load(cp, undefined, undefined, () => {
        this.coreLayers.forEach(layer => {
          layer.material.color = new THREE.Color(0x6600aa);
          layer.material.emissive = new THREE.Color(0x220033);
          layer.material.map = null;
          layer.material.needsUpdate = true;
        });
      });
      this.coreLayers[0].material.map = tex;
      this.coreLayers[0].material.needsUpdate = true;
    }
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
