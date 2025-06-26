import AnimationProvider from "../Utils/AnimationProvider";
import EventEmitter from "../Utils/EventEmitter";
import * as THREE from "three";

class Human extends EventEmitter {
  #STATE_IDLE = "idle";
  #STATE_TALK = "talk";
  #STATE_WALK = "walk";
  constructor({ scene, model, position, name, quaternion }) {
    super();

    this.type = "human";
    this.scene = scene;
    this.name = name;
    this.model = model;
    this.position = position;
    this.quaternion = quaternion;
    this.state = this.#STATE_IDLE;
    this.animationProvider = new AnimationProvider();

    this.init();
  }

  init() {
    this.character = this.model.scene.children[0];
    this.character.position.copy(this.position);
    this.character.quaternion.copy(this.quaternion);

    this.initMixer();
    this.initAnimation();
    this.updateAnimationState();

    this.scene.add(this.character);
  }

  update(delta) {
    this.mixer.update(delta * 0.001);
  }

  dispose() {
    this.scene.remove(this.character);
  }

  updateState(state) {
    if (state == this.state) return;
    this.state = state;
  }

  initMixer() {
    this.mixer = new THREE.AnimationMixer(this.character);
  }

  initAnimation() {
    this.animations = this.animationProvider.getAnimations(
      this.mixer,
      this.type
    );
  }
  updateAnimationState() {
    const animations = [];
    for (const name in this.animations) {
      if (name.split("_")[2] != this.state) continue;
      animations.push(this.animations[name]);
    }

    animations.forEach((a) => {
      a.reset();
      a.play();
    });
  }
}

export default Human;
