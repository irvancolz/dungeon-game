import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Camera {
  constructor({ scene, sizes, canvas, position }) {
    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;
    this.position = position;
    this.offset = new THREE.Vector3(0, 1, -1.45).multiplyScalar(7);

    // Setup
    this.init();
    // this.addControls();

    this.position.subscribe((st) => {
      this.target.copy(st);
      this.instance.position.copy(st).add(this.offset);
    });
  }

  init() {
    const camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.target = new THREE.Vector3().copy(this.position.getState());
    camera.position.copy(this.target).add(this.offset);

    camera.lookAt(this.target);
    this.instance = camera;
    this.scene.add(camera);
  }

  addControls() {
    // this.controls = new OrbitControls(this.instance, this.canvas);
    // this.controls.target = this.target;
    // this.controls.enableDamping = true;
  }

  update() {
    // this.controls.update();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
