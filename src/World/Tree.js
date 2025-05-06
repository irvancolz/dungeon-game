import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
export default class Tree {
  constructor({ scene, position, quaternion, debug, model, physicsWorld }) {
    this.scene = scene;
    this.position = position;
    this.quaternion = quaternion;
    this.debug = debug;
    this.model = model;
    this.physicsWorld = physicsWorld;

    this.init();
    // this.model.scene.position.copy(this.position);
    // this.scene.add(this.model.scene);
  }

  init() {
    const geometry = this.model.scene.children[0].geometry;
    const material = this.model.scene.children[0].material;

    this.mesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.position.length
    );

    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.position.length; i++) {
      dummy.position.copy(this.position[i]);
      dummy.quaternion.copy(this.quaternion[i]);

      // physics
      const colliderHalfHeight = 0.5;
      const colliderDesc = RAPIER.ColliderDesc.capsule(colliderHalfHeight, 0.3)
        .setTranslation(dummy.position.x, colliderHalfHeight, dummy.position.z)
        .setRotation(dummy.quaternion);
      this.physicsWorld.world.createCollider(colliderDesc);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }
}
