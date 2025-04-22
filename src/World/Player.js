import PlayerPhysics from "../Physics/Player";
import * as THREE from "three";
import CharacterControls from "../Utils/CharacterControls";

export default class Player {
  constructor({ scene, model, physics, debug, states }) {
    this.scene = scene;
    this.model = model;
    this.states = states;
    this.physicsWorld = physics;
    this.position = this.states.playerPosition.getState();
    this.controls = new CharacterControls();
    this.debug = debug;
    this.mvSpeed = 2;
    this.turningPower = Math.PI / 18;
    this.direction = new THREE.Vector3(0, 0, 0);
    this.moveDirection = new THREE.Vector3(0, 0, 0);

    this.controls.on("forward", () => {
      this.move();
    });

    this.controls.on("left", () => {
      if (this.controls.actions.backward) {
        this.turn(-this.turningPower);
      } else {
        this.turn(this.turningPower);
      }
      this.move();
    });

    this.controls.on("right", () => {
      if (this.controls.actions.backward) {
        this.turn(this.turningPower);
      } else {
        this.turn(-this.turningPower);
      }
      this.move();
    });

    this.controls.on("backward", () => {
      if (!this.moveBackward) {
        this.turn(-Math.PI);
      }
      this.move();
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
    this.physics = new PlayerPhysics({
      world: this.physicsWorld.world,
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
      f.addBinding(this, "mvSpeed", {
        min: 0.01,
        max: 30,
        step: 0.001,
      });
      f.addBinding(this, "turningPower", {
        min: Math.PI * 0.01,
        max: Math.PI * 0.5,
        step: 0.001,
      });
    }
  }

  update() {
    this.physics.update();
    this.moveBackward = this.controls.actions.backward;

    // keep move if button pressed
    if (this.controls.actions.forward || this.controls.actions.backward) {
      this.move();
    }

    this.character.position.copy(this.physics.body.translation());
    this.character.rotation.setFromVector3(this.direction);
    this.states.playerPosition.setState(this.character.position);
  }

  turn(degree) {
    this.direction.add({ x: 0, y: degree, z: 0 });
  }

  move() {
    this.moveDirection.set(
      Math.sin(this.direction.y),
      0,
      Math.cos(this.direction.y)
    );
    this.physics.move(this.moveDirection.multiplyScalar(this.mvSpeed));
  }

  jump() {}

  dispose() {}
}
