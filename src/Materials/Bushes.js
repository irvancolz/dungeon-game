import * as THREE from "three";
import bushesVertexShader from "../Shaders/bushes/vertex.glsl";
import bushesFragmentShader from "../Shaders/bushes/fragment.glsl";

export default function BushesMaterial() {
  const uniforms = {
    uLeavesTexture: new THREE.Uniform(),
    uLeavesColor: new THREE.Uniform(new THREE.Color("#164116")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: bushesVertexShader,
    fragmentShader: bushesFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  return material;
}
