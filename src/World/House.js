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
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.texture.flipY = false;
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
    });
    this.lightMaterial = EmissiveMaterial(
      "#ffdc3f",
      3,
      this.debug,
      "house light"
    );
    for (let i = 0; i < this.position.length; i++) {
      const group = new THREE.Group();
      this.model.scene.children.forEach((el) => {
        if (!el.name.includes("Emissive")) {
          el.material = this.material;
        } else {
          el.material = this.lightMaterial;
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
