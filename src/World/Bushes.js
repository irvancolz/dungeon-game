import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import BushesMaterial from "../Materials/Bushes";

export default class Bushes {
  constructor({ position, quaternion, scene, texture, debug, scales }) {
    this.position = position;
    this.quaternion = quaternion;
    this.scene = scene;
    this.height = 1;
    this.texture = texture;
    this.debug = debug;
    this.scales = scales;

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
      this.material.uniforms.uLeavesColor.value.set(debugOpt.color);
    });
  }

  initGeometry() {
    const planes = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const plane = new THREE.PlaneGeometry(this.height, this.height);

      // rotation
      const rotation = new THREE.Spherical(
        1 - Math.pow(Math.random(), 3),
        Math.PI * 2 * Math.random(),
        Math.PI * Math.random()
      );

      const position = new THREE.Vector3().setFromSpherical(rotation);
      plane.rotateX(Math.random() * 9999);
      plane.rotateY(Math.random() * 9999);
      plane.rotateZ(Math.random() * 9999);

      plane.translate(position.x, position.y, position.z);

      // normal
      const normal = position.clone().normalize();
      // 4 vert * 3 pos for plane
      const normalArray = new Float32Array(12);

      for (let i = 0; i < 4; i++) {
        const i3 = i * 3;

        const pos = new THREE.Vector3(
          plane.attributes.position.array[i3 + 0],
          plane.attributes.position.array[i3 + 1],
          plane.attributes.position.array[i3 + 2]
        );

        const mixedNormal = pos.lerp(normal, 0.4);

        normalArray[i3] = mixedNormal.x;
        normalArray[i3 + 1] = mixedNormal.y;
        normalArray[i3 + 2] = mixedNormal.z;
      }

      plane.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(normalArray, 3)
      );

      planes.push(plane);
    }

    this.geometry = mergeGeometries(planes, false);
  }

  initMaterial() {
    this.material = BushesMaterial();
    this.material.uniforms.uLeavesTexture.value = this.texture;
  }

  initMesh() {
    const count = 10;

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.position.length
    );
    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.position.length; i++) {
      dummy.position.copy(this.position[i]);
      dummy.quaternion.copy(this.quaternion[i]);
      dummy.scale.copy(this.scales[i]);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  init() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }
  update() {}
  dispose() {}
}
