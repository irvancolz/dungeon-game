import DebugFloor from "./DebugFloor";

export default class World {
  constructor({ scene, debug }) {
    this.scene = scene;
    this.debug = debug;

    this.floor = new DebugFloor({ scene: this.scene, debug: this.debug });
  }

  update() {}
}
