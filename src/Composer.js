import {
  EffectComposer,
  GammaCorrectionShader,
  RenderPass,
  ShaderPass,
  SMAAPass,
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
      expanded: false,
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
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.size.width,
      this.size.height,
      {
        samples: this.renderer.getPixelRatio() === 1 ? 2 : 0,
        format: THREE.RGBAFormat,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
      }
    );
    this.composer = new EffectComposer(this.renderer, this.renderTarget);

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.size.width, this.size.height),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = 0.48;
    this.bloomPass.strength = 0.36;
    this.bloomPass.radius = 0;
    this.composer.addPass(this.bloomPass);

    if (
      this.renderer.getPixelRatio() === 1 &&
      this.renderer.capabilities.isWebGL2
    ) {
      this.smaaPass = new SMAAPass();
      this.composer.addPass(this.smaaPass);
    }

    this.gammaCorrection = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(this.gammaCorrection);
  }

  resize() {
    this.composer.setSize(this.size.width, this.size.height);
    this.composer.setPixelRatio(this.size.pixelRatio);
  }

  update() {
    this.composer.render();
  }

  dispose() {}
}
