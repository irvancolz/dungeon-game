import * as THREE from "three";
import trunkVertexShader from "../Shaders/baseInstancedVert.glsl";
import trunkFragmentShader from "../Shaders/trunk/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function TrunkMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#2b160b")),
    uMossColor: new THREE.Uniform(new THREE.Color("#10341a")),
    uTime: new THREE.Uniform(0),
    uNoiseTexture: new THREE.Uniform(),
  };

  const material = new CustomShaderMaterial({
    uniforms,
    fragmentShader: trunkFragmentShader,
    baseMaterial: THREE.MeshStandardMaterial,
  });

  return material;
}
