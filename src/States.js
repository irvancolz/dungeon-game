import { createStore } from "./Utils/createStore";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from "three";

export default class States {
  static instance;

  static getInstance() {
    return States.instance;
  }
  constructor(debug) {
    if (States.instance != null) return States.instance;

    States.instance = this;

    this.debug = debug;
    this.time = new Time();
    this.sizes = new Sizes();

    //player
    this.playerPosition = createStore(new THREE.Vector3(0, 4, 0));
    this.playerTarget = createStore(new THREE.Vector3(0, 4, 8));
    this.playerDirection = createStore(new THREE.Vector3(0, 0, 0));

    // wind
    this.windStrength = 1;
    this.windDirection = new THREE.Vector2(1, 1);
    this.windSpeed = 1;

    if (this.debug) {
      this.addDebug();
    }
  }

  addDebug() {
    if (!this.debug.active) return;

    const wind = this.debug.ui.addFolder({ title: "wind", expanded: false });
    wind.addBinding(this, "windStrength", {
      label: "wind strength",
      min: 0.1,
      max: 2,
      step: 0.01,
    });
    wind.addBinding(this, "windSpeed", {
      label: "wind speed",
      min: 0.1,
      max: 5,
      step: 0.01,
    });
    wind.addBinding(this.windDirection, "x", {
      label: "wind x",
      min: -1,
      max: 1,
      step: 0.01,
    });
    wind.addBinding(this.windDirection, "y", {
      label: "wind y",
      min: -1,
      max: 1,
      step: 0.01,
    });
  }

  getUniforms() {
    return {
      uTime: new THREE.Uniform(0),
      uPlayerPosition: new THREE.Uniform(new THREE.Vector3()),
      uWindStrength: new THREE.Uniform(1),
      uWindSpeed: new THREE.Uniform(1),
      uWindDirection: new THREE.Uniform(new THREE.Vector2(1, 1)),
    };
  }

  updateUniforms(uniform) {
    uniform.uPlayerPosition.value = this.playerPosition.getState();
    uniform.uTime.value = this.time.elapsed;
    uniform.uWindStrength.value = this.windStrength;
    uniform.uWindSpeed.value = this.windSpeed;
    uniform.uWindDirection.value = this.windDirection;
  }
}
