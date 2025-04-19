import DebugFloor from "./DebugFloor";
import Player from "./Player";

export default class World {
  constructor({ scene, debug, resources, physics }) {
    this.scene = scene;
    this.debug = debug;
    this.resources = resources;
    this.physics = physics;

    this.player = new Player({
      scene: this.scene,
      model: this.resources.player,
      physics: this.physics,
      debug: this.debug,
    });
    this.floor = new DebugFloor({
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      width: 50,
    });
  }

  update() {
    this.player.update();
  }

  dispose() {}
}
