import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import BushesMaterial from "../Materials/Bushes";
import States from "../States";

export default class Bushes {
  constructor({
    position,
    scene,
    texture,
    debug,
    scales,
    color = "#209420",
    name = "bushes",
  }) {
    this.position = position;
    this.scene = scene;
    this.height = 1;
    this.texture = texture;
    this.debug = debug;
    this.scales = scales;
    this.color = color;
    this.name = name;

    this.states = States.getInstance();

    this.init();
    this.addDebug();
  }

  addDebug() {
    if (!this.debug.active) return;

    const debugOpt = {
      color: this.color,
    };

    const f = this.debug.ui.addFolder({ title: this.name, expanded: false });
    f.addBinding(debugOpt, "color").on("change", () => {
      this.material.uniforms.uLeavesColor.value.set(debugOpt.color);
    });
  }

  createLeaves(pos) {
    const leavesArray = [];

    const geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateY(Math.random() * Math.PI * 0.5);

    geometry.translate(pos.x, pos.y, pos.z);

    leavesArray.push(geometry);

    const result = mergeGeometries(leavesArray);
    const scale = Math.random() + 0.5;
    result.scale(scale, scale, 1);
    return result;
  }

  computeNormal() {
    const planePerLeaves = 1;
    const vertPerLeaves = 4;
    const leaves = this.leavesCount * planePerLeaves;
    const normalArray = new Float32Array(leaves * vertPerLeaves * 3);
    for (let v = 0; v < vertPerLeaves * leaves; v++) {
      const v3 = v * 3;

      const pos = new THREE.Vector3(
        this.geometry.attributes.position.array[v3],
        this.geometry.attributes.position.array[v3 + 1],
        this.geometry.attributes.position.array[v3 + 2]
      ).normalize();

      normalArray[v3] = pos.x;
      normalArray[v3 + 1] = pos.y;
      normalArray[v3 + 2] = pos.z;
    }

    this.geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normalArray, 3)
    );
  }

  initGeometry() {
    const base = new THREE.IcosahedronGeometry(1, 1);
    const arr = base.attributes.position;
    this.leavesCount = arr.count;
    const centerArray = [];
    const leaves = [];

    for (let i = 0; i < this.leavesCount; i++) {
      const i3 = i * 3;

      const offset = Math.random() - 0.5;
      const x = offset + arr.array[i3];
      const y = offset + arr.array[i3 + 1];
      const z = offset + arr.array[i3 + 2];

      const pos = new THREE.Vector3(x, y, z);

      for (let j = 0; j < 4; j++) {
        centerArray.push(x, y, z);
      }

      const leavesGeometry = this.createLeaves(pos);
      leaves.push(leavesGeometry);
    }

    this.geometry = mergeGeometries(leaves);
    this.geometry.setAttribute(
      "aCenter",
      new THREE.Float32BufferAttribute(new Float32Array(centerArray), 3)
    );
    this.computeNormal();
  }

  initMaterial() {
    this.material = BushesMaterial(this.color, this.states);
    this.material.uniforms.uLeavesTexture.value = this.texture;
  }

  initMesh() {
    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.position.length
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.position.length; i++) {
      dummy.position.copy(this.position[i]);
      // dummy.scale.copy(this.scales[i]);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  init() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }
  update(elapsed) {
    this.states.updateUniforms(this.material.uniforms);
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.leaves.dispose;
  }
}
