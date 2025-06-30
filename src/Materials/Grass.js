import * as THREE from "three";
import grassVertexShader from "../Shaders/grass/vertex.glsl";
import grassFragmentShader from "../Shaders/grass/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function GrassMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#085944")),
    uTime: new THREE.Uniform(0),
    uFieldSize: new THREE.Uniform(0),
    // global uniform
    uPlayerPosition: new THREE.Uniform(new THREE.Vector3()),
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
