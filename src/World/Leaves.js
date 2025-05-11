import * as THREE from "three";
import LeavesMaterial from "../Materials/Leaves";

export default class Leaves {
  constructor({
    texture,
    positions = [],
    quaternions = [],
    scales = [],
    scene,
  }) {
    this.texture = texture;
    this.positions = positions;
    this.quaternions = quaternions;
    this.scales = scales;
    this.scene = scene;
    this.size = 4;

    this.init();
  }

  init() {
    this.geometry = new THREE.PlaneGeometry(this.size, this.size, 1, 1);
    this.material = LeavesMaterial();
    this.material.uniforms.uLeavesTexture.value = this.texture;

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.positions.length
    );

    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.positions.length; i++) {
      dummy.position.copy(this.positions[i]);
      dummy.quaternion.copy(this.quaternions[i]);
      dummy.scale.copy(this.scales[i]);

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }
}
