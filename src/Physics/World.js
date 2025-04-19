import RAPIER from "@dimforge/rapier3d";

export default class WorldPhysics {
  constructor() {
    this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
    this.world = new RAPIER.World(this.gravity);
  }
  update() {
    this.world.step();
  }
}
