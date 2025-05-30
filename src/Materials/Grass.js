import * as THREE from "three";
import grassVertexShader from "../Shaders/grass/vertex.glsl";
import grassFragmentShader from "../Shaders/grass/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function GrassMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#168e08")),
    uTime: new THREE.Uniform(0),
    // global uniform
    uWindStrength: new THREE.Uniform(1),
    uWindSpeed: new THREE.Uniform(1),
    uWindDirection: new THREE.Uniform(new THREE.Vector2(1, 1)),
  };

  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    fragmentShader: grassFragmentShader,
    vertexShader: grassVertexShader,
    uniforms,
  });

  return material;
}
