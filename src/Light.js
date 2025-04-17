import * as THREE from "three";

export default class Light {
  constructor({ scene, debug }) {
    this.scene = scene;
    this.debug = debug;

    this.config = {
      intensity: 4,
      color: new THREE.Color(0xffffff),
      x: 3.5,
      y: 2,
      z: -1.25,
    };

    this.init();

    // Debugger
    if (this.debug.active) {
      const debugFolder = this.debug.ui.addFolder({
        title: "Light",
        expanded: false,
      });
      debugFolder
        .addBinding(this.config, "intensity", {
          min: 0.01,
          max: 10,
          step: 0.01,
        })
        .on("change", () => {
          this.configure();
        });

      debugFolder
        .addBinding(this.config, "y", {
          min: 0.01,
          max: 10,
          step: 0.01,
        })
        .on("change", () => {
          this.configure();
        });

      debugFolder.addBinding(this.config, "color").on("change", () => {
        this.configure();
      });
    }
  }

  init() {
    this.light = new THREE.DirectionalLight(
      this.config.color,
      this.config.intensity
    );
    this.light.castShadow = true;
    this.light.shadow.camera.far = 15;
    this.light.shadow.mapSize.set(1024, 1024);
    this.light.shadow.normalBias = 0.05;
    this.light.position.set(this.config.x, this.config.y, this.config.z);
    this.scene.add(this.light);
  }

  configure() {
    this.light.color = this.config.color;
    this.light.intensity = this.config.intensity;
    this.light.position.set(this.config.x, this.config.y, this.config.z);
  }
}
