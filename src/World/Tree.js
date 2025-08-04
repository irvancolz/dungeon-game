import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import TreeMaterial from "../Materials/Tree";
import Bushes from "./Bushes";
import WorldObject from "../Utils/WorldObject";
export default class Tree extends WorldObject {
  constructor({ position, quaternion, model, leaves }) {
    super();
    this.position = position;
    this.quaternion = quaternion;
    this.model = model;
    this.colliders = [];

    // leaves
    this.leavesTexture = leaves;
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

  addLeaves() {
    let pos = [];
    let scale = [];
    let quat = [];

    for (let i = 0; i < this.position.length; i++) {
      const src = this.ref.clone();
      // src.quaternion.copy(this.quaternion[i]);

      const p = src.children.map((el) =>
        el.position.applyQuaternion(this.quaternion[i]).add(this.position[i])
      );
      pos.push(...p);

      const s = src.children.map((el) => el.scale);
      scale.push(...s);

      const q = src.children.map((el) => el.quaternion);
      quat.push(...q);
    }

    this.leaves = new Bushes({
      position: pos,
      texture: this.leavesTexture,
      scales: scale,
      name: "tree leaves",
      color: "#af2879",
    });
    this.leaves.setScene(this.scene);
    this.leaves.setDebugger(this.debug);
    this.leaves.setStates(this.states);
    this.leaves.init();
  }

  init() {
    this.ref = this.model.scene.children[0];
    this.geometry = this.ref.geometry;

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
      const collider = this.physics.world.createCollider(colliderDesc);
      this.colliders.push(collider);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.addLeaves();
    this.addDebug();
  }

  update(src) {
    this.leaves.update(src.getElapsed());
  }
  dispose() {
    this.colliders.forEach((col) => {
      this.physics.world.removeCollider(col);
    });
    this.scene.remove(this.mesh);
    this.leaves.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.mesh.dispose();
  }
}
