import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Camera {
  constructor({ scene, sizes, canvas, position }) {
    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;
    this.position = position;
    this.offset = new THREE.Vector3(0, 1, -2).multiplyScalar(7);
    this.pointerControl = false;

    // Setup
    this.init();
    this.addControls();

    this.position.subscribe((st) => {
      this.target.copy(st).add({ x: 0, y: 2, z: 0 });
      this.instance.position.copy(st).add(this.offset);
    });

    document.addEventListener("pointerdown", () => {
      this.pointerControl = true;
    });

    document.addEventListener("pointerup", () => {
      this.pointerControl = false;
    });

    document.addEventListener("pointermove", (e) => {
      if (!this.pointerControl) return;
      // TODO : apply custom controls
    });
  }

  init() {
    const camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      600
    );
    this.target = new THREE.Vector3()
      .copy(this.position.getState())
      .add({ x: 0, y: 2, z: 0 });
    camera.position.copy(this.target).add(this.offset);

    camera.lookAt(this.target);
    this.instance = camera;
    this.scene.add(camera);
  }

  addControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.target = this.target;
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
