import * as THREE from "three";
import vertex from "./plane.vert.glsl";
import fragment from "./plane.frag.glsl";

export default class Plane {
  constructor(scene) {
    this.scene = scene;

    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }

  initGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 4, 4);
  }

  initMaterial() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
    });
  }

  initMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
