import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";

export default class Fence {
  constructor({ model, scene, physics, position = [], quaternion = [] }) {
    this.model = model;
    this.scene = scene;
    this.position = position;
    this.quaternion = quaternion;
    this.physicsWorld = physics;

    this.init();
  }

  init() {
    this.geometry = this.model.scene.children[0].geometry;
    this.material = this.model.scene.children[0].material;

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
