import RAPIER from "@dimforge/rapier3d";
import GroundMaterial from "../Materials/Ground";
import * as THREE from "three";
import { mix, smoothstep } from "../Utils/math";

export default class Ground {
  constructor({ scene, debug, texture, size, physics }) {
    this.scene = scene;
    this.debug = debug;
    this.texture = texture;
    this.size = size;
    this.physicsFieldSize = this.size + 1;
    this.physics = physics;
    this.maxHeight = 0.58;
    this.material = GroundMaterial(texture, this.maxHeight);

    this.extractTextureMap();

    this.init();
    this.addDebug();
  }

  convertToRapierCoord(line, col) {
    const _line = this.physicsFieldSize - col;
    const _col = this.physicsFieldSize - line;
    return _line * this.physicsFieldSize + _col;
  }

  extractTextureMap() {
    const canvas = document.createElement("canvas");
    canvas.width = this.size;
    canvas.height = this.size;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.texture.image, 0, 0);

    canvas.style.position = "fixed";
    canvas.style.zIndex = 1000;

    const img = ctx.getImageData(0, 0, this.size, this.size);

    // https://github.com/dimforge/rapier.js/issues/138
    this.physicsVertexHeight = new Float32Array(this.physicsFieldSize ** 2);

    // normalized and get rgb value
    // texture is read from top left -> top right corner but the rapier start drawing from right bottom -> right up
    // mapping to rapier coord
    // rapier coord is (size + 1) ** 2
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const i = y * this.size + x;
        let height = img.data[i * 4] / 255;
        height = smoothstep(0.01, 0.3, height);

        const idx = this.convertToRapierCoord(y, x);
        this.physicsVertexHeight[idx] = mix(0, this.maxHeight, height);
      }
    }
  }

  initPhysics() {
    const sz = this.size;
    const map = this.physicsVertexHeight;
    this.colliderDesc = RAPIER.ColliderDesc.heightfield(
      sz,
      sz,
      map,
      new RAPIER.Vector3(sz, 1, sz)
    ).setFriction(1);
    this.collider = this.physics.world.createCollider(this.colliderDesc);
  }

  initGeometry() {
    this.geometry = new THREE.PlaneGeometry(
      this.size,
      this.size,
      this.size,
      this.size
    );
  }

  init() {
    this.initPhysics();
    this.initGeometry();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // idk why texture is flipped,
    this.mesh.rotation.x = Math.PI * 0.5;
    this.mesh.rotation.y = -Math.PI;

    this.scene.add(this.mesh);
  }

  addDebug() {
    if (!this.debug.active) return;

    const debugOpt = {
      color: "#283937",
      edgeColor: "#5d5d5d",
    };

    const f = this.debug.ui.addFolder({ title: "ground", expanded: false });
    f.addBinding(this.mesh, "visible");
    f.addBinding(this.material.uniforms.uMaxHeight, "value", {
      min: 0.1,
      max: 5,
      step: 0.01,
      label: "max height",
    });
    f.addBinding(debugOpt, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(debugOpt.color);
    });
    f.addBinding(debugOpt, "edgeColor").on("change", () => {
      this.material.uniforms.uEdgeColor.value.set(debugOpt.edgeColor);
    });
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.material.dispose();
    this.geometry.dispose();
  }
}
