import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import EmissiveMaterial from "../Materials/Emissive";
import WoodDarkMaterial from "../Materials/WoodDark";
import WallMaterial from "../Materials/Wall";

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
      "#346965",
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

    this.wallMaterial = WallMaterial();
    this.wallMaterial.uniforms.uColor.value = new THREE.Color("#333333");

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#333333",
    };

    const f = this.debug.ui.addFolder({
      title: "house wall",
      expanded: true,
    });
    f.addBinding(debugObj, "color").on("change", () => {
      this.wallMaterial.uniforms.uColor.value.set(debugObj.color);
    });
  }

  init() {
    for (let i = 0; i < this.position.length; i++) {
      const house = this.model.scene.children[0].clone();

      house.traverse((e) => {
        if (e.isMesh) {
          e.castShadow = true;
          e.receiveShadow = true;
        }
        if (e.name.toLowerCase().includes("wood")) {
          e.material = this.woodMaterial;
        } else if (e.name.toLowerCase().includes("roof")) {
          e.material = this.roofMaterial;
        } else if (e.name.toLowerCase().includes("modelhouse")) {
          e.material = this.wallMaterial;
        } else if (e.name.toLowerCase().includes("windowglass")) {
          e.material = this.windowMaterial;
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
