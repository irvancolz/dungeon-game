import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Composer {
  constructor({ renderer, scene, camera, size, debug }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.size = size;
    this.debug = debug;

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;
    const bloomFolder = this.debug.ui.addFolder({
      title: "bloom",
      expanded: true,
    });
    bloomFolder.addBinding(this.bloomPass, "strength", {
      min: 0,
      max: 1,
      step: 0.01,
    });
    bloomFolder.addBinding(this.bloomPass, "threshold", {
      min: 0,
      max: 1,
      step: 0.01,
    });
    bloomFolder.addBinding(this.bloomPass, "radius", {
      min: 0,
      max: 1.5,
      step: 0.01,
    });
  }

  init() {
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.size.width, this.size.height),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 0.37;
    this.bloomPass.radius = 0;

    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.addPass(this.renderPass);
    this.finalComposer.addPass(this.bloomPass);
  }

  resize(width, height) {}

  update() {
    this.finalComposer.render();
  }

  dispose() {}
}
