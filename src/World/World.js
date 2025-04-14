import Plane from "./Plane/Plane";

export default class World {
  constructor({ scene }) {
    this.scene = scene;
    this.plane = new Plane(scene);
  }

  update() {}
}
