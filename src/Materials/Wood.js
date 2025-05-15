import * as THREE from "three";
import woodVertexShader from "../Shaders/baseInstancedVert.glsl";
import woodFragmentShader from "../Shaders/wood/fragment.glsl";

export default function WoodMaterial(color, noiseColor) {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color(color)),
    uNoiseColor: new THREE.Uniform(new THREE.Color(noiseColor)),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: woodVertexShader,
    fragmentShader: woodFragmentShader,
    uniforms,
  });

  return material;
}
