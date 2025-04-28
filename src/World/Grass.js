import * as THREE from "three";
import GrassMaterial from "../Materials/Grass";

export default class Grass {
  constructor({ size, scene, states, debug }) {
    this.size = size;
    this.count = size ** 2;
    this.bladeHeight = 0.5;
    // this.bladeHeightRatio = 0.2;
    this.bladeHalfWidth = 0.15;
    this.scene = scene;
    this.states = states;
    this.debug = debug;

    this.init();
    this.initDebug();
  }

  initMaterial() {
    this.material = GrassMaterial();
    this.material.uniforms.uGrassDistance.value = this.size;
  }

  initGeometry() {
    // 3 pos per vert 3 vert per blade
    const vertPerBlade = 3;
    this.positionsArray = new Float32Array(this.count * vertPerBlade * 3);
    this.centerArray = new Float32Array(this.count * vertPerBlade * 2);

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const i = y * this.size + x;
        // update if vertPerBlade not 3
        const i9 = i * vertPerBlade * 3;
        const i6 = i * vertPerBlade * 2;

        const posX = x * 0.5 + (Math.random() - 0.5) - this.size * 0.25;
        const posY = y * 0.5 + (Math.random() - 0.5) - this.size * 0.25;

        // left
        this.centerArray[i6 + 0] = posX;
        this.centerArray[i6 + 1] = posY;
        this.positionsArray[i9 + 0] = posX - this.bladeHalfWidth;
        this.positionsArray[i9 + 1] = 0;
        this.positionsArray[i9 + 2] = posY;

        // right
        this.centerArray[i6 + 2] = posX;
        this.centerArray[i6 + 3] = posY;
        this.positionsArray[i9 + 3] = posX + this.bladeHalfWidth;
        this.positionsArray[i9 + 4] = 0;
        this.positionsArray[i9 + 5] = posY;

        // top
        this.centerArray[i6 + 4] = posX;
        this.centerArray[i6 + 5] = posY;
        this.positionsArray[i9 + 6] = posX;
        this.positionsArray[i9 + 7] = this.bladeHeight;
        this.positionsArray[i9 + 8] = posY;
      }
    }
    this.geometry = new THREE.BufferGeometry();

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.positionsArray, 3)
    );
    this.geometry.setAttribute(
      "aCenter",
      new THREE.Float32BufferAttribute(this.centerArray, 2)
    );
  }

  init() {
    this.initMaterial();
    this.initGeometry();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
  }

  initDebug() {
    if (!this.debug.active) return;
    const opt = {
      color: "#ff0000",
    };
    const f = this.debug.ui.addFolder({
      title: "grass",
      expanded: true,
    });
    f.addBinding(this, "bladeHeight", {
      min: 0.1,
      max: 1,
      step: 0.01,
    });
    f.addBinding(opt, "color");
  }

  update() {
    const playerPos = this.states.playerPosition.getState();

    this.material.uniforms.uPlayerPosition.value.copy(playerPos);
    this.material.uniforms.uTime.value = this.states.time.elapsed;
    this.mesh.position.set(playerPos.x, 0, playerPos.z);
  }
  dispose() {}
}
