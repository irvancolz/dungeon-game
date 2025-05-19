import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import TreeMaterial from "../Materials/Tree";
import Bushes from "./Bushes";
export default class Tree {
  constructor({
    scene,
    position,
    quaternion,
    debug,
    model,
    physicsWorld,
    leaves,
    leavesMatcap,
  }) {
    this.scene = scene;
    this.position = position;
    this.quaternion = quaternion;
    this.debug = debug;
    this.model = model;
    this.physicsWorld = physicsWorld;

    // leaves
    this.leavesTexture = leaves;
    this.leavesMatcap = leavesMatcap;

    this.init();
    this.addLeaves();
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

  addLeaves() {
    let pos = [];
    let scale = [];
    let quat = [];

    for (let i = 0; i < this.position.length; i++) {
      const p = this.ref.children.map((el) =>
        el.position.add(this.position[i])
      );
      pos.push(...p);

      const s = this.ref.children.map((el) => el.scale);
      scale.push(...s);

      const q = this.ref.children.map((el) => el.quaternion);
      quat.push(...q);
    }

    this.leaves = new Bushes({
      position: pos,
      scene: this.scene,
      debug: this.debug,
      matcap: this.leavesMatcap,
      texture: this.leavesTexture,
      scales: scale,
    });
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
      this.physicsWorld.world.createCollider(colliderDesc);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  update(elapsed) {
    this.leaves.update(elapsed);
  }
}
