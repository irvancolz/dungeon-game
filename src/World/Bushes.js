import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import BushesMaterial from "../Materials/Bushes";
import Leaves from "./Leaves";

export default class Bushes {
  constructor({ position, scene, texture, debug, scales, model }) {
    this.position = position;
    this.scene = scene;
    this.height = 1;
    this.texture = texture;
    this.debug = debug;
    this.scales = scales;
    this.model = model;
    this.stem = model.scene.children[0];

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;

    const debugOpt = {
      color: "#113111",
    };

    const f = this.debug.ui.addFolder({ title: "bushes", expanded: false });
    f.addBinding(debugOpt, "color").on("change", () => {
      this.leaves.material.uniforms.uLeavesColor.value.set(debugOpt.color);
    });
  }

  initLeaves() {
    const leavesCount = 40;
    const vertPerLeaves = 4;
    const leavesArray = [];

    for (let i = 0; i < leavesCount; i++) {
      const x = Math.random() - 0.5;
      const y = (Math.random() - 0.5) * 0.8;
      const z = Math.random() - 0.5;

      const angle = Math.random() * Math.PI;

      const geometry = new THREE.PlaneGeometry(1, 1);
      geometry.translate(x, y, z);
      geometry.rotateY(angle);

      leavesArray.push(geometry);
    }

    this.leavesGeometry = mergeGeometries(leavesArray);

    const normalArray = new Float32Array(leavesCount * vertPerLeaves * 3);
    for (let v = 0; v < vertPerLeaves * leavesCount; v++) {
      const v3 = v * 3;

      const pos = new THREE.Vector3(
        this.leavesGeometry.attributes.position.array[v3],
        this.leavesGeometry.attributes.position.array[v3 + 1],
        this.leavesGeometry.attributes.position.array[v3 + 2]
      );

      normalArray[v3] = pos.x;
      normalArray[v3 + 1] = pos.y;
      normalArray[v3 + 2] = pos.z;
    }

    this.leavesGeometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normalArray, 3)
    );

    this.leavesMaterial = BushesMaterial();
    this.leavesMaterial.uniforms.uLeavesTexture.value = this.texture;

    this.leaves = new THREE.InstancedMesh(
      this.leavesGeometry,
      this.leavesMaterial,
      this.position.length
    );

    this.scene.add(this.leaves);
  }

  initGeometry() {
    this.geometry = this.stem.geometry;
  }

  initMaterial() {
    this.material = new THREE.MeshBasicMaterial({ color: "#2b160b" });
  }

  initMesh() {
    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.position.length
    );
    // this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.position.length; i++) {
      dummy.position.copy(this.position[i]);
      // dummy.position.copy(new THREE.Vector3());

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
      this.leaves.setMatrixAt(i, dummy.matrix);
    }
  }

  init() {
    this.initLeaves();
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }
  update(elapsed) {}

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.leaves.dispose;
  }
}
