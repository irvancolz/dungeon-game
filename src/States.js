import { createStore } from "./Utils/createStore";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from "three";
export default class States {
  constructor() {
    this.time = new Time();
    this.sizes = new Sizes();
    this.playerPosition = createStore(new THREE.Vector3(0, 4, 0));
  }
}
