import * as THREE from "three";
import gsap from "gsap";

let instance = null;
export default class Camera {
  constructor({ scene, sizes, canvas, playerPosition, debug, target }) {
    if (instance != null) {
      return instance;
    }

    instance = this;

    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;
    this.debug = debug;
    this.playerPosition = playerPosition;
    this.angle = 90;
    this.tiltPower = 1;
    this.zoomPower = 1;
    this.offsetMultiplier = 24;
    this.offset = new THREE.Vector3(1, 0.457, -0.37);
    this.pointerControl = false;
    this.attachedToPlayer = true;

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
      const x = (e.clientX / sizes.width - 0.5) * 2;
      const y = (e.clientY / sizes.height - 0.5) * 2;
      this.pointerStart = new THREE.Vector2(x, y);
    });

    document.addEventListener("pointerup", () => {
      this.pointerControl = false;
    });

    document.addEventListener("pointermove", (e) => {
      if (!this.pointerControl) return;
      const x = (e.clientX / sizes.width - 0.5) * 2;
      const y = (e.clientY / sizes.height - 0.5) * 2;

      const pointerDelta = new THREE.Vector2(
        this.pointerStart.x - x,
        this.pointerStart.y - y
      );

      this.pointerStart.set(x, y);

      // handle swipe in directional way
      const newAngle = this.angle + pointerDelta.x * this.tiltPower;
      this.angle = newAngle;

      // handle swipe in vertical way
      const minElevation = 0;
      const maxElevation = 1;
      const elevation = Math.min(
        maxElevation,
        Math.max(minElevation, this.offset.y - pointerDelta.y * this.tiltPower)
      );

      this.offset.y = elevation;

      this.calculatePosition();
    });
  }

  addDebug() {
    if (!this.debug.active) return;
    const f = this.debug.ui.addFolder({ title: "camera", expanded: false });

    f.addBinding(this, "zoomPower", { min: 0.1, max: 5, step: 0.1 }).on(
      "change",
      () => {
        this.calculatePosition();
      }
    );
    f.addBinding(this, "tiltPower", { min: 0.1, max: 10, step: 0.1 }).on(
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

    if (this.attachedToPlayer) {
      const playerPos = new THREE.Vector3().copy(
        this.playerPosition.getState()
      );
      this.target = playerPos;
    }

    const newCamPos = new THREE.Vector3().copy(this.target).add(offset);

    this.instance.position.copy(newCamPos);
    this.instance.lookAt(this.target);
  }

  focus(target) {
    //  add animation perhaps
    this.attachedToPlayer = false;
    this.animateTargetChange(target);
  }

  focusPlayer() {
    this.animateTargetChange(this.playerPosition.getState());
    setTimeout(() => {
      this.attachedToPlayer = true;
    }, 1000);
  }

  animateTargetChange(newTarget) {
    // gsap modify refference
    const t = new THREE.Vector3().copy(newTarget);
    gsap.to(this.target, {
      x: t.x,
      y: t.y,
      z: t.z,
      onComplete: () => {
        this.target.copy(t);
      },
      duration: 1,
    });
  }
}
