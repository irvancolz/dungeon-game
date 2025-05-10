import EmissiveMaterial from "../Materials/Emissive";
import Camera from "../Camera";

export default class LampPost {
  constructor({ model, scene, debug, position, quaternion }) {
    this.model = model.scene;
    this.scene = scene;
    this.debug = debug;
    this.position = position;
    this.quaternion = quaternion;
    this.instances = [];

    this.init();
  }

  init() {
    this.glassMaterial = EmissiveMaterial(
      "#f0d07a",
      1,
      this.debug,
      "lamp post"
    );

    for (let i = 0; i < this.position.length; i++) {
      const lamp = this.model.children[0].clone();
      lamp.children[0].material = this.glassMaterial;

      lamp.position.copy(this.position[i]);
      lamp.quaternion.copy(this.quaternion[i]);

      this.instances.push(lamp);
    }

    this.scene.add(...this.instances);
  }
  update() {}

  dispose() {
    this.scene.remove(...this.instances);
  }
}
