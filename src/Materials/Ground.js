import * as THREE from "three";
import groundVertexShader from "../Shaders/ground/vertex.glsl";
import groundFragmentShader from "../Shaders/ground/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function GroundMaterial() {
  const uniforms = {
    uMaxHeight: new THREE.Uniform(),
    uMapTexture: new THREE.Uniform(),
    uColor: new THREE.Uniform(new THREE.Color("#168c00")),
    uEdgeColor: new THREE.Uniform(new THREE.Color("#696967")),
  };

  const material = new CustomShaderMaterial({
    vertexShader: groundVertexShader,
    fragmentShader: groundFragmentShader,
    uniforms,
    baseMaterial: THREE.MeshStandardMaterial,
  });

  return material;
}
