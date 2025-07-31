import * as THREE from "three";
import EmissiveMaterial from "../Materials/Emissive";
import WorldObject from "../Utils/WorldObject";

export default class LampPost extends WorldObject {
  constructor({ model, texture, position = [], quaternion = [] }) {
    super();
    this.model = model.scene;
    this.position = position;
    this.quaternion = quaternion;
    this.instances = [];
    this.texture = texture;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.flipY = false;
  }

  init() {
    this.glassMaterial = EmissiveMaterial(
      "#6c5109",
      0.402,
      this.debug,
      "lamp post"
    );

    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
    });

    for (let i = 0; i < this.position.length; i++) {
      const group = new THREE.Group();
      this.model.children.forEach((el) => {
        if (!el.name.includes("Emissive")) {
          el.material = this.material;
        } else {
          el.material = this.glassMaterial;
        }

        group.add(el.clone());
        group.position.copy(this.position[i]);
        group.quaternion.copy(this.quaternion[i]);
        this.instances.push(group);
      });

      this.scene.add(...this.instances);
    }
  }
  update() {}

  dispose() {
    this.scene.remove(...this.instances);
  }
}
