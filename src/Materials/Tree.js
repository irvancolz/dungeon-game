import * as THREE from "three";
import trunkVertexShader from "../Shaders/baseInstancedVert.glsl";
import trunkFragmentShader from "../Shaders/tree/fragment.glsl";

export default function TreeMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#575151")),
    uTime: new THREE.Uniform(0),
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: trunkVertexShader,
    fragmentShader: trunkFragmentShader,
  });

  return material;
}
