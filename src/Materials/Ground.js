import * as THREE from "three";
import groundVertexShader from "../Shaders/ground/vertex.glsl";
import groundFragmentShader from "../Shaders/ground/fragment.glsl";

export default function GroundMaterial() {
  const uniforms = {
    uMaxHeight: new THREE.Uniform(),
    uMapTexture: new THREE.Uniform(),
    uColor: new THREE.Uniform(new THREE.Color("#1f2a28")),
    uEdgeColor: new THREE.Uniform(new THREE.Color("#39362c")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: groundVertexShader,
    fragmentShader: groundFragmentShader,
    uniforms,
  });

  return material;
}
