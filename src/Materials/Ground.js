import * as THREE from "three";
import groundVertexShader from "../Shaders/ground/vertex.glsl";
import groundFragmentShader from "../Shaders/ground/fragment.glsl";

export default function GroundMaterial(texture, maxHeight) {
  const uniforms = {
    uMaxHeight: new THREE.Uniform(maxHeight),
    uMapTexture: new THREE.Uniform(texture),
    uColor: new THREE.Uniform(new THREE.Color("#1f2a28")),
    uEdgeColor: new THREE.Uniform(new THREE.Color("#3e3f40")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: groundVertexShader,
    fragmentShader: groundFragmentShader,
    uniforms,
  });

  return material;
}
