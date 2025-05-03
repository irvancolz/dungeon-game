import * as THREE from "three";

export default class Camera {
  constructor({ scene, sizes, canvas, playerPosition, debug }) {
    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;
    this.debug = debug;
    this.playerPosition = playerPosition;
    this.angle = 90;
    this.viewMultiplier = 0.1;
    this.zoomPower = 1;
    this.offsetMultiplier = 24;
    this.offset = new THREE.Vector3(1, 0.457, -0.37);
    this.pointerControl = false;

    // Setup
    this.init();
    this.addDebug();

    document.addEventListener("wheel", (e) => {
      const delta = e.wheelDelta;

      // +1 if down, -1 if up
      const orientation = delta / Math.abs(delta);
      const maxZoomOut = 30;
      const maxZoomIn = 4;
      const newMult = Math.min(
        maxZoomOut,
        Math.max(
          maxZoomIn,
          this.offsetMultiplier - orientation * this.zoomPower
        )
      );

      this.offsetMultiplier = newMult;
      this.calculatePosition();
    });

    document.addEventListener("pointerdown", (e) => {
      if (e.target.id != "canvas") return;
      this.pointerControl = true;
    });

    document.addEventListener("pointerup", () => {
      this.pointerControl = false;
    });

    document.addEventListener("pointermove", (e) => {
      if (!this.pointerControl) return;
      const x = (e.clientX / sizes.width - 0.5) * 2;
      const y = (e.clientY / sizes.height - 0.5) * 2;

      this.angle = ((Math.atan2(x, y) * -180) / Math.PI) * this.viewMultiplier;
      this.calculatePosition();
    });
  }

  addDebug() {
    if (!this.debug.active) return;
    const f = this.debug.ui.addFolder({ title: "camera", expanded: true });
    f.addBinding(this.offset, "y", { min: -1, max: 1, step: 0.001 }).on(
      "change",
      () => {
        this.calculatePosition();
      }
    );
    f.addBinding(this, "zoomPower", { min: 0.1, max: 5, step: 0.1 }).on(
      "change",
      () => {
        this.calculatePosition();
      }
    );
  }

  init() {
    const camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      600
    );
    this.target = new THREE.Vector3().copy(this.playerPosition.getState());

    camera.position.copy(this.target);

    camera.lookAt(this.target);
    this.instance = camera;
    this.scene.add(camera);
  }

  update() {
    if (!this.pointerControl) {
      this.calculatePosition();
    }
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  calculatePosition() {
    const x = Math.sin(this.angle);
    const z = Math.cos(this.angle);

    const offset = new THREE.Vector3()
      .copy({ x, y: this.offset.y, z })
      .multiplyScalar(this.offsetMultiplier);
    const playerPos = new THREE.Vector3().copy(this.playerPosition.getState());
    this.target = playerPos;
    const newCamPos = new THREE.Vector3().copy(playerPos).add(offset);

    this.instance.position.copy(newCamPos);
    this.instance.lookAt(playerPos);
  }
}
