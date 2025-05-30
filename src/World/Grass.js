import * as THREE from "three";
import GrassMaterial from "../Materials/Grass";

export default class Grass {
  constructor({
    density,
    scene,
    debug,
    width,
    position = new THREE.Vector3(),
  }) {
    this.density = density;
    this.width = width;
    this.count = density * width ** 2;
    this.position = position;

    this.BLADE_HEIGHT = 0.5;
    this.BLADE_WIDTH = 0.02;
    this.BLADE_HEIGHT_VARIATION = 0.5;

    this.scene = scene;
    this.debug = debug;

    this.positionsArray = [];
    this.uvsArray = [];
    this.colorsArray = [];
    this.indiciesArray = [];
    this.centersArray = [];

    this.init();
    this.initDebug();
  }

  initMaterial() {
    // this.material = new THREE.MeshBasicMaterial();
    this.material = GrassMaterial();
  }

  initGeometry() {
    const VERT_PER_BLADE = 5;
    const SURFACE_MIN = this.width * 0.5 * -1;
    const SURFACE_MAX = this.width * 0.5;

    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.width; col++) {
        for (let idx = 0; idx < this.density; idx++) {
          const i = row * this.width * this.density + col * this.density + idx;

          const x = row - this.width * 0.5 + 0.5 + (Math.random() - 0.5);
          const y = col - this.width * 0.5 + 0.5 + (Math.random() - 0.5);

          const center = new THREE.Vector3(x, 0, y).add(this.position);

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
      }
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
    this.mesh.receiveShadow = true;
    // this.mesh.castShadow = true;

    this.scene.add(this.mesh);
  }

  initDebug() {
    if (!this.debug.active) return;
    const opt = {
      color: "#168e08",
    };
    const f = this.debug.ui.addFolder({
      title: "grass",
      expanded: false,
    });
    f.addBinding(opt, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(opt.color);
    });
    f.addBinding(this.material.uniforms.uWindStrength, "value", {
      label: "wind strength",
      min: 0.1,
      max: 2,
      step: 0.01,
    });
    f.addBinding(this.material.uniforms.uWindSpeed, "value", {
      label: "wind speed",
      min: 0.1,
      max: 5,
      step: 0.01,
    });
    f.addBinding(this.material.uniforms.uWindDirection.value, "x", {
      label: "wind x",
      min: -1,
      max: 1,
      step: 0.01,
    });
    f.addBinding(this.material.uniforms.uWindDirection.value, "y", {
      label: "wind y",
      min: -1,
      max: 1,
      step: 0.01,
    });
    f.addBinding(this, "density", {
      min: 1,
      max: 300,
      step: 1,
    }).on("change", (e) => {
      if (!e.last) return;
      this.positionsArray = [];
      this.uvsArray = [];
      this.colorsArray = [];
      this.indiciesArray = [];
      this.centersArray = [];
      this.scene.remove(this.mesh);
      this.geometry.dispose();
      this.material.dispose();

      this.init();
    });
  }

  update(playerPos, time) {
    this.material.uniforms.uTime.value = time;
    // this.mesh.position.set(playerPos.x, 0, playerPos.z);
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.material.dispose();
    this.geometry.dispose();
  }

  // https://github.com/James-Smyth/three-grass-demo/blob/main/src/index.js
  generateBlade(center, vArrOffset, uv) {
    const MID_WIDTH = this.BLADE_WIDTH * 1.75;
    const TIP_OFFSET = 0.1;
    const height = this.BLADE_HEIGHT;

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
      new THREE.Vector3().multiplyScalar(TIP_OFFSET)
    );

    tl.y += height * 0.6;
    tr.y += height * 0.6;
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
