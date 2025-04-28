import RAPIER from "@dimforge/rapier3d";
import DebugFloorMaterial from "../Materials/DebugFloor";
import * as THREE from "three";

export default class DebugFloor {
  constructor({ scene, debug, physics, width }) {
    this.scene = scene;
    this.debug = debug;
    this.physics = physics;
    this.width = width;

    this.init();
    this.initDebug();
  }

  initDebug() {
    if (!this.debug.active) return;
    const debugObj = {
      uBoardColor: "#1b1b1b",
      uLineColor: "#ffffff",
    };

    const f = this.debug.ui.addFolder({
      title: "debug floor",
      expanded: false,
    });
    f.addBinding(this.material.uniforms.uSize, "value", {
      min: 1,
      max: 1000,
      step: 1,
      label: "count",
    });
    f.addBinding(this.material.uniforms.uLineWidth, "value", {
      min: 0.001,
      max: 1,
      step: 0.001,
      label: "line width",
    });
    f.addBinding(debugObj, "uBoardColor").on("change", () => {
      this.material.uniforms.uBoardColor.value.set(debugObj.uBoardColor);
    });
    f.addBinding(debugObj, "uLineColor").on("change", () => {
      this.material.uniforms.uLineColor.value.set(debugObj.uLineColor);
    });
  }

  init() {
    // Physics
    this.colliderDesc = RAPIER.ColliderDesc.cuboid(
      this.width / 2,
      0.01,
      this.width / 2
    ).setFriction(1);
    this.collider = this.physics.world.createCollider(this.colliderDesc);

    // Visual
    this.material = DebugFloorMaterial();
    this.material.uniforms.uSize.value = this.width;
    this.geometry = new THREE.PlaneGeometry(this.width, this.width);
    this.geometry.rotateX(-Math.PI * 0.5);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
