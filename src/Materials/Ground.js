import * as THREE from "three";
import groundVertexShader from "../Shaders/ground/vertex.glsl";
import groundFragmentShader from "../Shaders/ground/fragment.glsl";

export default function GroundMaterial(texture, maxHeight) {
  const uniforms = {
    uMaxHeight: new THREE.Uniform(maxHeight),
    uMapTexture: new THREE.Uniform(texture),
    uColor: new THREE.Uniform(new THREE.Color("#283937")),
    uEdgeColor: new THREE.Uniform(new THREE.Color("#5d5d5d")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: groundVertexShader,
    fragmentShader: groundFragmentShader,
    uniforms,
  });

  return material;
}
