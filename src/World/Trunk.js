import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import TrunkMaterial from "../Materials/Trunk";

export default class Trunk {
  constructor({
    model,
    scene,
    physics,
    position,
    quaternion,
    debug,
    noiseTexture,
  }) {
    this.model = model;
    this.scene = scene;
    this.physicsWorld = physics;
    this.position = position;
    this.quaternion = quaternion;
    this.debug = debug;
    this.noiseTexture = noiseTexture;

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#2b160b",
      mossColor: "#10341a",
    };

    const f = this.debug.ui.addFolder({ title: "trunks", expanded: false });
    f.addBinding(debugObj, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(debugObj.color);
    });
    f.addBinding(debugObj, "mossColor").on("change", () => {
      this.material.uniforms.uMossColor.value.set(debugObj.mossColor);
    });
  }

  initGeometry() {
    this.geometry = this.model.scene.children[0].geometry;
  }

  initMaterial() {
    this.material = TrunkMaterial();
    this.material.uniforms.uNoiseTexture.value = this.noiseTexture;
  }

  initMesh() {
    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.position.length
    );

    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.position.length; i++) {
      const quaternion = this.quaternion[i];
      const position = this.position[i];

      dummy.position.copy(position);
      dummy.quaternion.copy(quaternion);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);

      // physics
      const colliderDesc = RAPIER.ColliderDesc.capsule(1, 0.2)
        .setTranslation(position.x, position.y + 1, position.z)
        .setRotation(quaternion);
      this.physicsWorld.world.createCollider(colliderDesc);
    }
  }

  init() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }

  dispose() {}
}
