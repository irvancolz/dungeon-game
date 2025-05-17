import * as THREE from "three";
import vertexShader from "../Shaders/baseVertex.glsl";
import fragmentShader from "../Shaders/wall/fragment.glsl";

export default function WallMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  });

  return material;
}
