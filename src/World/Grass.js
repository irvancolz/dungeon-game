import * as THREE from "three";
import GrassMaterial from "../Materials/Grass";

export default class Grass {
  constructor({ size, scene, states, debug, radius, resources }) {
    this.size = size;
    this.count = size ** 2;
    this.radius = radius;

    this.BLADE_HEIGHT = 0.6;
    this.BLADE_WIDTH = 0.1;
    this.BLADE_HEIGHT_VARIATION = 0.5;

    this.scene = scene;
    this.states = states;
    this.debug = debug;
    this.resources = resources;

    this.positionsArray = [];
    this.uvsArray = [];
    this.colorsArray = [];
    this.indiciesArray = [];
    this.centersArray = [];

    this.init();
    this.initDebug();
  }

  initMaterial() {
    this.material = GrassMaterial();
    this.material.uniforms.uGrassDistance.value = this.radius * 2;
    this.material.uniforms.uMaxHeightRatio.value = this.BLADE_HEIGHT;
  }

  initGeometry() {
    const VERT_PER_BLADE = 5;
    const SURFACE_MIN = this.radius * -1;
    const SURFACE_MAX = this.radius;

    for (let i = 0; i < this.count; i++) {
      const r = Math.sqrt(Math.random()) * this.radius;
      const angle = Math.PI * 2 * Math.random();
      const x = Math.sin(angle) * r;
      const y = Math.cos(angle) * r;

      // const x = (Math.random() - 0.5) * 2 * this.radius;
      // const y = (Math.random() - 0.5) * 2 * this.radius;

      const center = new THREE.Vector3(x, 0, y);

      const uv = [
        this.convertRange(center.x, SURFACE_MIN, SURFACE_MAX, 0, 1),
        this.convertRange(center.z, SURFACE_MIN, SURFACE_MAX, 0, 1),
      ];

      const blade = this.generateBlade(center, i * VERT_PER_BLADE, uv);
      blade.verts.forEach((vert) => {
        this.positionsArray.push(...vert.pos);
        this.uvsArray.push(...vert.uv);
        this.colorsArray.push(...vert.color);
        this.centersArray.push(center.x, center.z);
      });
      blade.indices.forEach((i) => this.indiciesArray.push(i));
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(this.positionsArray), 3)
    );
    this.geometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(new Float32Array(this.uvsArray), 2)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(this.colorsArray), 3)
    );
    this.geometry.setAttribute(
      "aCenter",
      new THREE.Float32BufferAttribute(new Float32Array(this.centersArray), 2)
    );

    this.geometry.setIndex(this.indiciesArray);
    this.geometry.computeVertexNormals();
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
      color: "#0d9632",
    };
    const f = this.debug.ui.addFolder({
      title: "grass",
      expanded: true,
    });
    f.addBinding(this.material.uniforms.uMaxHeightRatio, "value", {
      min: 0.1,
      max: 3,
      step: 0.01,
      label: "blade height",
    });
    f.addBinding(opt, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(opt.color);
    });
  }

  update() {
    const playerPos = this.states.playerPosition.getState();

    this.material.uniforms.uPlayerPosition.value.copy(playerPos);
    this.mesh.position.set(playerPos.x, 0, playerPos.z);
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.material.dispose();
    this.geometry.dispose();
  }

  // https://github.com/James-Smyth/three-grass-demo/blob/main/src/index.js
  generateBlade(center, vArrOffset, uv) {
    const MID_WIDTH = this.BLADE_WIDTH * 0.5;
    const TIP_OFFSET = 0.1;
    const height =
      this.BLADE_HEIGHT + Math.random() * this.BLADE_HEIGHT_VARIATION;

    const yaw = Math.random() * Math.PI * 2;
    const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const tipBend = Math.random() * Math.PI * 2;
    const tipBendUnitVec = new THREE.Vector3(
      Math.sin(tipBend),
      0,
      -Math.cos(tipBend)
    );

    // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
    const bl = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawUnitVec)
        .multiplyScalar((this.BLADE_WIDTH / 2) * 1)
    );
    const br = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawUnitVec)
        .multiplyScalar((this.BLADE_WIDTH / 2) * -1)
    );
    const tl = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1)
    );
    const tr = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1)
    );
    const tc = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET)
    );

    tl.y += height / 2;
    tr.y += height / 2;
    tc.y += height;

    // Vertex Colors
    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1.0, 1.0, 1.0];

    const verts = [
      { pos: bl.toArray(), uv: uv, color: black },
      { pos: br.toArray(), uv: uv, color: black },
      { pos: tr.toArray(), uv: uv, color: gray },
      { pos: tl.toArray(), uv: uv, color: gray },
      { pos: tc.toArray(), uv: uv, color: white },
    ];

    const indices = [
      vArrOffset,
      vArrOffset + 1,
      vArrOffset + 2,
      vArrOffset + 2,
      vArrOffset + 4,
      vArrOffset + 3,
      vArrOffset + 3,
      vArrOffset,
      vArrOffset + 2,
    ];

    return { verts, indices };
  }

  convertRange(val, oldMin, oldMax, newMin, newMax) {
    return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  }
}
