import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Camera {
  constructor({ scene, sizes, canvas }) {
    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;

    // Setup
    this.init();
    this.addControls();
  }

  init() {
    const camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);
    this.instance = camera;
    this.scene.add(camera);
  }

  addControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
