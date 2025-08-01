import RAPIER from "@dimforge/rapier3d";

class WorldPhysics {
  static instance;

  static getInstance() {
    return WorldPhysics.getInstance();
  }

  constructor() {
    if (WorldPhysics.instance) return WorldPhysics.instance;

    WorldPhysics.instance = this;
    this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
  }
  init() {
    this.world = new RAPIER.World(this.gravity);
  }
  update() {
    this.world.step();
  }
  dispose() {
    this.world.free();
    this.world = null;
  }
}

export default WorldPhysics;
