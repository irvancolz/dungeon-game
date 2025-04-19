import PlayerPhysics from "../Physics/Player";
import * as THREE from "three";
import CharacterControls from "../Utils/CharacterControls";

export default class Player {
  constructor({ scene, model, physics, debug }) {
    this.scene = scene;
    this.model = model;
    this.physics = physics;
    this.position = new THREE.Vector3(0, 5, 0);
    this.controls = new CharacterControls();
    this.debug = debug;
    this.baseMovement = 1;

    this.controls.on("forward", () => {
      this.moveForward();
    });
    this.controls.on("left", () => {
      this.moveLeft();
    });
    this.controls.on("right", () => {
      this.moveRight();
    });
    this.controls.on("backward", () => {
      this.moveBackward();
    });
    this.controls.on("jump", () => {
      this.jump();
    });

    this.init();
    this.addDebug();
  }

  init() {
    this.character = this.model.scene.children[0];
    this.character.position.copy(this.position);
    const box3 = new THREE.Box3();

    box3.expandByObject(this.character);
    const dimension = new THREE.Vector3();
    box3.getSize(dimension);

    this.scene.add(this.character);

    // physics and debug physics
    this._physics = new PlayerPhysics({
      world: this.physics.world,
      position: this.position,
      height: dimension.y,
    });
  }

  addDebug() {
    if (this.debug.active) {
      const f = this.debug.ui.addFolder({
        title: "character",
        expanded: true,
      });
      f.addBinding(this, "baseMovement", {
        min: 0.01,
        max: 3,
        step: 0.001,
      });
    }
  }

  update() {
    this._physics.update();
    this.character.position.copy(this._physics.body.translation());
  }

  moveForward() {
    this._physics.moveForward();
  }

  moveBackward() {
    this._physics.moveBackward();
  }

  moveRight() {
    this._physics.moveRight();
  }

  moveLeft() {
    this._physics.moveLeft();
  }

  jump() {
    this._physics.jump();
  }

  dispose() {}
}
