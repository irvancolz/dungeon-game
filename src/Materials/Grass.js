import * as THREE from "three";
import grassVertexShader from "../Shaders/grass/vertex.glsl";
import grassFragmentShader from "../Shaders/grass/fragment.glsl";

export default function GrassMaterial() {
  const uniforms = {
    uPlayerPosition: new THREE.Uniform(new THREE.Vector3()),
    uGrassDistance: new THREE.Uniform(),
    uColor: new THREE.Uniform(new THREE.Color("#148606")),
    uMaxHeightRatio: new THREE.Uniform(),
    uFieldSize: new THREE.Uniform(),
    uGroundHeight: new THREE.Uniform(),
    uCemeteryTexture: new THREE.Uniform(),
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: grassVertexShader,
    fragmentShader: grassFragmentShader,
    // wireframe: true,
  });

  return material;
}
