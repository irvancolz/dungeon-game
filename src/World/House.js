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
    texture,
  }) {
    this.scene = scene;
    this.model = model;
    this.position = position;
    this.quaternion = quaternion;
    this.physicsWorld = physics;
    this.debug = debug;
    this.texture = texture;

    this.windowMaterial = EmissiveMaterial(
      "#907418",
      0.217,
      this.debug,
      "window"
    );

    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.flipY = false;
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
    });

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
      this.scene.add(group);

      // physics
      const houseHeight = 2;
      const houseHalfWidth = 3.2;
      const houseHalfDepth = 4.8;
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
