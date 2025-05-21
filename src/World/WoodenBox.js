import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import WoodDarkMaterial from "../Materials/WoodDark";
import WoodLightMaterial from "../Materials/WoodLight";

export default class WoodenBox {
  constructor({ model, scene, physics, position, quaternion, debug, alpha }) {
    this.model = model;
    this.scene = scene;
    this.physicsWorld = physics;
    this.position = position;
    this.quaternion = quaternion;
    this.debug = debug;
    this.alphaTexture = alpha;

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      color: "#765430",
      noiseColor: "#66420c",
    };

    const f = this.debug.ui.addFolder({
      title: "wooden boxes",
      expanded: false,
    });
    f.addBinding(debugObj, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(debugObj.color);
    });
    f.addBinding(debugObj, "noiseColor").on("change", () => {
      this.material.uniforms.uNoiseColor.value.set(debugObj.noiseColor);
    });
  }

  initGeometry() {
    this.geometry = new THREE.BoxGeometry();
  }

  initMaterial() {
    this.material = WoodLightMaterial(true, this.alphaTexture);
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
      const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
        .setTranslation(position.x, position.y, position.z)
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
