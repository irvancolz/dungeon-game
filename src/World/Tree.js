import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import TreeMaterial from "../Materials/Tree";
export default class Tree {
  constructor({ scene, position, quaternion, debug, model, physicsWorld }) {
    this.scene = scene;
    this.position = position;
    this.quaternion = quaternion;
    this.debug = debug;
    this.model = model;
    this.physicsWorld = physicsWorld;

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#575151",
    };

    const f = this.debug.ui.addFolder({ title: "tree", expanded: false });
    f.addBinding(debugObj, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(debugObj.color);
    });
  }

  init() {
    this.geometry = this.model.scene.children[0].geometry;

    this.material = TreeMaterial();

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
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
