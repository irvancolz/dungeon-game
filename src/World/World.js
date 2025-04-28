import DebugFloor from "./DebugFloor";
import Graves from "./Graves";
import Player from "./Player";
import Ground from "./Ground";
import Grass from "./Grass";
export default class World {
  constructor({ scene, debug, resources, physics, states }) {
    this.scene = scene;
    this.debug = debug;
    this.resources = resources;
    this.map = resources.map;
    this.physics = physics;
    this.states = states;
    this.width = 256;
    this.grassFieldSize = 10;

    this.player = new Player({
      scene: this.scene,
      model: this.resources.player,
      physics: this.physics,
      debug: this.debug,
      states: this.states,
    });

    this.floor = new DebugFloor({
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      width: this.width,
    });

    // this.ground = new Ground({
    //   scene: this.scene,
    //   debug: this.debug,
    //   texture: this.resources.cemeteryTexture,
    //   size: this.width,
    //   physics: this.physics,
    // });

    this.grass = new Grass({
      size: this.grassFieldSize,
      scene: this.scene,
      debug: this.debug,
      states: this.states,
    });

    // this.addGraves();
  }

  update() {
    this.player.update();
    this.grass.update();
  }

  addGraves() {
    this.gravesRef = this.map.scene.children.filter((i) => {
      return i.name.startsWith("Grave");
    });

    this.graves = new Graves({
      positions: this.gravesRef.map((i) => i.position),
      model: this.resources.grave,
      scene: this.scene,
      debug: this.debug,
    });
  }

  dispose() {
    this.graves.dispose();
    this.player.dispose();
  }
}
