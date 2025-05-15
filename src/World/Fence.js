import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import WoodDarkMaterial from "../Materials/WoodDark";

export default class Fence {
  constructor({
    model,
    scene,
    physics,
    noise,
    position = [],
    quaternion = [],
    debug,
  }) {
    this.model = model;
    this.scene = scene;
    this.position = position;
    this.quaternion = quaternion;
    this.physicsWorld = physics;
    this.noise = noise;
    this.debug = debug;

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#281b07",
      noiseColor: "#392b16",
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
        .setTranslation(dummy.position.x, fenceHeight, dummy.position.z)
        .setRotation(dummy.quaternion);
      const collider = this.physicsWorld.world.createCollider(colliderDesc);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }
}
