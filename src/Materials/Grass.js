import * as THREE from "three";
import grassVertexShader from "../Shaders/grass/vertex.glsl";
import grassFragmentShader from "../Shaders/grass/fragment.glsl";

export default function GrassMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#179908")),
    uTime: new THREE.Uniform(0),
    // global uniform
    uWindStrength: new THREE.Uniform(1),
    uWindSpeed: new THREE.Uniform(1),
    uWindDirection: new THREE.Uniform(new THREE.Vector2(1, 1)),
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: grassVertexShader,
    fragmentShader: grassFragmentShader,
  });

  return material;
}
