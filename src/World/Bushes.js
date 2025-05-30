import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import BushesMaterial from "../Materials/Bushes";

export default class Bushes {
  constructor({ position, scene, texture, debug, scales, matcap }) {
    this.position = position;
    this.scene = scene;
    this.height = 1;
    this.texture = texture;
    this.debug = debug;
    this.scales = scales;
    this.matcap = matcap;
    matcap.colorSpace = THREE.SRGBColorSpace;

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
    f.addBinding(this.material, "alphaTest", {
      min: 0,
      max: 1,
      step: 0.01,
    });
  }

  createLeaves(pos) {
    // base
    const rotations = [
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: 0,
        y: Math.PI / 2,
        z: 0,
      },
      {
        x: Math.PI / 2,
        y: 0,
        z: 0,
      },
    ];

    const leavesCount = rotations.length;
    const leavesArray = [];

    for (let i = 0; i < leavesCount; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1);

      geometry.translate(pos.x, pos.y, pos.z);

      geometry.rotateX(rotations[i].x);
      geometry.rotateY(rotations[i].y);
      geometry.rotateZ(rotations[i].z);

      leavesArray.push(geometry);
    }

    const result = mergeGeometries(leavesArray);
    result.rotateX(Math.random() * Math.PI);
    result.rotateY(Math.random() * Math.PI);
    result.rotateZ(Math.random() * Math.PI);
    return result;
  }

  computeNormal() {
    const planePerLeaves = 3;
    const vertPerLeaves = 4;
    const leaves = this.leavesCount * planePerLeaves;
    const normalArray = new Float32Array(leaves * vertPerLeaves * 3);
    for (let v = 0; v < vertPerLeaves * leaves; v++) {
      const v3 = v * 3;

      const pos = new THREE.Vector3(
        this.geometry.attributes.position.array[v3],
        this.geometry.attributes.position.array[v3 + 1],
        this.geometry.attributes.position.array[v3 + 2]
      );

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
    const base = new THREE.IcosahedronGeometry(1, 0);
    const pos = base.attributes.position;
    this.leavesCount = pos.count;
    const leaves = [];

    for (let i = 0; i < this.leavesCount; i++) {
      const i3 = i * 3;
      const leavesGeometry = this.createLeaves(
        new THREE.Vector3(pos.array[i3], pos.array[i3 + 1], pos.array[i3 + 2])
      );
      leaves.push(leavesGeometry);
    }

    this.geometry = mergeGeometries(leaves);
    this.computeNormal();
  }

  initMaterial() {
    this.uniforms = {
      uTime: { value: 0 },
    };
    // this.material = new THREE.MeshNormalMaterial();
    this.material = BushesMaterial(this.matcap, this.texture);

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.uniforms.uTime;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
        #include <common>

        uniform float uTime;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>

        float time = uTime * .005;
        float windPower = .1;

        float offset = time * position.y + transformed.y;

        transformed.xz += vec2(sin(uv.x + offset), sin(uv.y + offset)) * windPower;
        `
      );
    };
    // this.material.uniforms.uLeavesTexture.value = this.texture;
    // this.material.uniforms.uMatcapTexture.value = this.matcap;
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
      dummy.scale.copy(this.scales[i]);
      // dummy.position.copy(new THREE.Vector3());

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
      // this.leaves.setMatrixAt(i, dummy.matrix);
    }
  }

  init() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }
  update(elapsed) {
    this.uniforms.uTime.value = elapsed;
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.leaves.dispose;
  }
}
