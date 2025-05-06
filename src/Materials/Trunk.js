import * as THREE from "three";
import trunkVertexShader from "../Shaders/baseInstancedVert.glsl";
import trunkFragmentShader from "../Shaders/trunk/fragment.glsl";

export default function TrunkMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#2b160b")),
    uMossColor: new THREE.Uniform(new THREE.Color("#10341a")),
    uTime: new THREE.Uniform(0),
    uNoiseTexture: new THREE.Uniform(),
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: trunkVertexShader,
    fragmentShader: trunkFragmentShader,
  });

  return material;
}
