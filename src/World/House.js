import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import EmissiveMaterial from "../Materials/Emissive";
import WorldObject from "../Utils/WorldObject";

export default class House extends WorldObject {
  constructor({ model, position = [], quaternion = [], texture }) {
    super();
    this.model = model;
    this.position = position;
    this.quaternion = quaternion;
    this.texture = texture;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.flipY = false;
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
    });
    this.colliders = [];
    this.groups = [];
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#333333",
    };
  }

  init() {
    this.windowMaterial = EmissiveMaterial(
      "#907418",
      0.217,
      this.debug,
      "window"
    );
    for (let i = 0; i < this.position.length; i++) {
      const group = new THREE.Group();
      this.model.scene.children.forEach((el) => {
        if (!el.name.includes("Emissive")) {
          el.material = this.material;
        } else {
          el.material = this.windowMaterial;
        }

        group.add(el.clone());
      });

      group.position.copy(this.position[i]);
      group.quaternion.copy(this.quaternion[i]);
      this.groups.push(group);
      this.scene.add(group);

      this._addPhysics(
        this.position[i].x,
        this.position[i].z,
        this.quaternion[i]
      );
    }

    this.addDebug();
  }

  _addPhysics(x, z, quaternion) {
    // physics
    const houseHeight = 2;
    const houseHalfWidth = 3.2;
    const houseHalfDepth = 4.8;
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      houseHalfWidth,
      houseHeight,
      houseHalfDepth
    )
      .setTranslation(x, houseHeight, z)
      .setRotation(quaternion);
    const colider = this.physics.world.createCollider(colliderDesc);
    this.colliders.push(colider);
  }
  dispose() {
    this.material.dispose();
    this.groups.forEach((el) => {
      this.scene.remove(el);
    });
    this.colliders.forEach((col) => {
      this.physics.world.removeCollider(col);
    });
  }
}
