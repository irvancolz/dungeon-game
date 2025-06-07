import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "../Shaders/bushes/vertex.glsl";
import fragmentShader from "../Shaders/bushes/fragment.glsl";

export default function BushesMaterial(color) {
  const uniforms = {
    uLeavesTexture: new THREE.Uniform(),
    uMatcapTexture: new THREE.Uniform(),
    uLeavesColor: new THREE.Uniform(new THREE.Color(color)),
    uTime: new THREE.Uniform(0),
  };

  const material = new THREE.ShaderMaterial({
    // baseMaterial: THREE.MeshStandardMaterial,
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: true,
    side: THREE.DoubleSide,
  });

  // const material = new THREE.MeshNormalMaterial();

  return material;
}
