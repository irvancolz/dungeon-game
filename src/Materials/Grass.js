import * as THREE from "three";
import grassVertexShader from "../Shaders/grass/vertex.glsl";
import grassFragmentShader from "../Shaders/grass/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function GrassMaterial(global) {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#085944")),
    uFieldSize: new THREE.Uniform(0),
    // global uniform
    ...global.getUniforms(),
  };

  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    fragmentShader: grassFragmentShader,
    vertexShader: grassVertexShader,
    uniforms,
  });

  return material;
}
