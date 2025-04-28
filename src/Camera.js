import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Camera {
  constructor({ scene, sizes, canvas, playerPosition }) {
    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;
    this.playerPosition = playerPosition;
    this.offset = new THREE.Vector3(0, 0.4, -2.5).multiplyScalar(7);
    this.pointerControl = false;

    // Setup
    this.init();
    this.addControls();

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
      .copy(this.playerPosition.getState())
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
    const playerPos = new THREE.Vector3().copy(this.playerPosition.getState());
    const newCamPos = new THREE.Vector3().copy(playerPos).add(this.offset);
    const dist = this.instance.position.distanceTo(newCamPos);

    if (!this.pointerControl) {
      this.target.copy(playerPos).add({ x: 0, y: 0, z: 8 });
      this.instance.position.copy(newCamPos);
    }

    this.controls.update();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
