import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import WoodDarkMaterial from "../Materials/WoodDark";
import WorldObject from "../Utils/WorldObject";

export default class Fence extends WorldObject {
  constructor({ model, position = [], quaternion = [] }) {
    super();
    this.model = model;
    this.position = position;
    this.quaternion = quaternion;
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#342a19",
      noiseColor: "#2b1f0d",
    };

    const f = this.debug.ui.addFolder({
      title: "wood (fence)",
      expanded: true,
    });
    f.addBinding(debugObj, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(debugObj.color);
    });
    f.addBinding(debugObj, "noiseColor").on("change", () => {
      this.material.uniforms.uNoiseColor.value.set(debugObj.noiseColor);
    });
  }

  init() {
    this.geometry = this.model.scene.children[0].geometry;
    this.material = WoodDarkMaterial();

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.position.length
    );
    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.position.length; i++) {
      dummy.quaternion.copy(this.quaternion[i]);
      dummy.position.copy(this.position[i]);
      dummy.position.y = 0;

      this._addPhysics(dummy.position.x, dummy.position.z, dummy.quaternion);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
    this.addDebug();
  }
  _addPhysics(x, z, quaternion) {
    // physics
    const fenceHeight = 1;
    // sorry the model is rather deep than wide :(
    const fenceHalfWidth = 0.1;
    const fenceHalfDepth = 2;
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      fenceHalfWidth,
      fenceHeight,
      fenceHalfDepth
    )
      .setTranslation(x, fenceHeight, z)
      .setRotation(quaternion);
    this.physics.world.createCollider(colliderDesc);
  }
}
