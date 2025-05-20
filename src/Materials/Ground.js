import * as THREE from "three";
import groundVertexShader from "../Shaders/ground/vertex.glsl";
import groundFragmentShader from "../Shaders/ground/fragment.glsl";

export default function GroundMaterial() {
  const uniforms = {
    uMaxHeight: new THREE.Uniform(),
    uMapTexture: new THREE.Uniform(),
    uColor: new THREE.Uniform(new THREE.Color("#336342")),
    uEdgeColor: new THREE.Uniform(new THREE.Color("#696967")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: groundVertexShader,
    fragmentShader: groundFragmentShader,
    uniforms,
  });

  return material;
}
