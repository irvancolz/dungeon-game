import * as THREE from "three";
import woodVertexShader from "../Shaders/baseInstancedVert.glsl";
import singleVertexShader from "../Shaders/baseVertex.glsl";
import woodFragmentShader from "../Shaders/wood/fragment.glsl";

export default function WoodMaterial(color, noiseColor, instanced = true) {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color(color)),
    uNoiseColor: new THREE.Uniform(new THREE.Color(noiseColor)),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: instanced ? woodVertexShader : singleVertexShader,
    fragmentShader: woodFragmentShader,
    uniforms,
  });

  return material;
}
