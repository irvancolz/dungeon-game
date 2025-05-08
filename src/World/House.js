import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import EmissiveMaterial from "../Materials/Emissive";

export default class House {
  constructor({
    scene,
    model,
    physics,
    position = [],
    quaternion = [],
    debug,
  }) {
    this.scene = scene;
    this.model = model;
    this.position = position;
    this.quaternion = quaternion;
    this.physicsWorld = physics;
    this.debug = debug;
    this.windowMaterial = EmissiveMaterial(
      "#a19880",
      0.522,
      this.debug,
      "window"
    );

    this.init();
  }

  init() {
    for (let i = 0; i < this.position.length; i++) {
      const house = this.model.scene.children[0].clone();

      const windowGlass = house.children.find((el) => el.name == "WindowGlass");
      windowGlass.material = this.windowMaterial;

      house.position.copy(this.position[i]);
      house.quaternion.copy(this.quaternion[i]);
      this.scene.add(house);

      // physics
      const houseHeight = 2;
      const houseHalfWidth = 4.5;
      const houseHalfDepth = 3.2;
      const colliderDesc = RAPIER.ColliderDesc.cuboid(
        houseHalfWidth,
        houseHeight,
        houseHalfDepth
      )
        .setTranslation(this.position[i].x, houseHeight, this.position[i].z)
        .setRotation(this.quaternion[i]);
      this.physicsWorld.world.createCollider(colliderDesc);
    }
  }
}
