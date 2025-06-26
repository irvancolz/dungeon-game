import * as THREE from "three";

let instance = null;

class AnimationProvider {
  constructor() {
    if (instance != null) return instance;

    instance = this;
    this.animations = [];
  }

  addPlaylist(list = []) {
    this.animations.push(...list);
  }

  getAnimations(mixer, type) {
    const result = {};

    const animations = this.animations.filter(
      (anim) => anim.name.split("_")[0].toLowerCase() == type.toLowerCase()
    );
    animations.forEach((anim) => {
      result[anim.name] = mixer.clipAction(anim);
    });

    return result;
  }
}

export default AnimationProvider;
