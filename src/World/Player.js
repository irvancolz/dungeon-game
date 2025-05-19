import PlayerPhysics from "../Physics/Player";
import * as THREE from "three";
import Controller from "../Utils/Controller";

export default class Player {
  #STATE_IDLE = "idle";
  #STATE_JUMP = "jump";
  #STATE_RUN = "run";
  #STATE_FALL = "fall";

  constructor({ scene, model, physics, debug, states }) {
    this.scene = scene;
    this.model = model;
    this.states = states;
    this.physicsWorld = physics;
    this.position = this.states.playerPosition.getState();
    this.controls = new Controller();
    this.debug = debug;
    this.mvSpeed = 6;
    this.turningPower = Math.PI / 18;
    this.direction = new THREE.Vector3(0, 0, 0);
    this.moveDirection = new THREE.Vector3(0, 0, 0);
    this.jumpPower = 9;
    this.state = null;

    this.controls.on("idle", () => {
      this.updateState(this.#STATE_IDLE);
    });

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
    this.initAnimation();
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
        expanded: false,
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
      f.addBinding(this, "jumpPower", {
        min: 1,
        max: 15,
        step: 0.5,
      });
      f.addButton({ title: "reset player" }).on("click", () => {
        this.physics.reset();
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

    this.mixer.update(this.states.time.delta * 0.001);

    const newPos = this.physics.body.translation();

    const prevY = this.character.position.y;
    const newY = newPos.y;
    const distY = newY - prevY;

    if (distY <= 0 && this.physics.floating) {
      this.updateState(this.#STATE_FALL);
    } else if (!this.physics.floating && this.controls.idle) {
      this.updateState(this.#STATE_IDLE);
    }

    this.character.position.copy(newPos);
    this.character.rotation.setFromVector3(this.direction);
    this.states.playerPosition.setState(this.character.position);
  }

  turn(degree) {
    this.direction.add({ x: 0, y: degree, z: 0 });
  }

  move() {
    if (this.state == this.#STATE_JUMP || this.physics.floating) return;

    this.updateState(this.#STATE_RUN);
    this.moveDirection.set(
      Math.sin(this.direction.y),
      0,
      Math.cos(this.direction.y)
    );
    this.physics.move(this.moveDirection.multiplyScalar(this.mvSpeed));
  }

  jump() {
    if (
      this.state == this.#STATE_FALL ||
      this.state == this.#STATE_JUMP ||
      this.physics.floating
    )
      return;
    this.updateState(this.#STATE_JUMP);
    setTimeout(() => {
      this.physics.jump(this.jumpPower);
    }, 200);
  }

  initAnimation() {
    const animationList = this.model.animations;
    this.mixer = new THREE.AnimationMixer(this.character);
    this.animations = {};

    this.animations.idle = this.mixer.clipAction(
      animationList.find((anim) => anim.name == this.#STATE_IDLE)
    );
    this.animations.run = this.mixer.clipAction(
      animationList.find((anim) => anim.name == this.#STATE_RUN)
    );
    this.animations.fall = this.mixer.clipAction(
      animationList.find((anim) => anim.name == this.#STATE_FALL)
    );
    this.animations.jump = this.mixer.clipAction(
      animationList.find((anim) => anim.name == this.#STATE_JUMP)
    );

    // revent error on first load
    this.animations.current = this.animations.idle;

    this.updateState(this.#STATE_IDLE);
  }

  updateState(state) {
    if (state == this.state) return;
    this.state = state;
    this.updateAnimation(state);
  }

  updateAnimation(state) {
    const newAnimation = this.animations[state];

    const oldAnimation = this.animations.current;

    newAnimation.reset();
    newAnimation.play();
    newAnimation.crossFadeFrom(oldAnimation, 0.3);

    this.animations.current = newAnimation;
  }

  dispose() {}
}
