import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import EmissiveMaterial from "../Materials/Emissive";
import WoodDarkMaterial from "../Materials/WoodDark";

export default class House {
  constructor({
    scene,
    model,
    physics,
    position = [],
    quaternion = [],
    debug,
    roofTexture,
  }) {
    this.scene = scene;
    this.model = model;
    this.position = position;
    this.quaternion = quaternion;
    this.physicsWorld = physics;
    this.debug = debug;
    this.windowMaterial = EmissiveMaterial(
      "#f0d07a",
      0.522,
      this.debug,
      "window"
    );
    this.woodMaterial = WoodDarkMaterial(false);

    roofTexture.colorSpace = THREE.SRGBColorSpace;
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    this.roofMaterial = new THREE.MeshStandardMaterial({
      map: roofTexture,
      side: THREE.DoubleSide,
    });

    this.init();
  }

  init() {
    for (let i = 0; i < this.position.length; i++) {
      const house = this.model.scene.children[0].clone();

      house.traverse((e) => {
        if (e.name.toLowerCase().includes("wood")) {
          e.material = this.woodMaterial;
        } else if (e.name.toLowerCase().includes("roof")) {
          e.material = this.roofMaterial;
        } else {
        }
      });

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
