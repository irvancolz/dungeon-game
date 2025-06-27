import * as THREE from "three";
import treeFragmentShader from "../Shaders/tree/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function TreeMaterial() {
  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color("#575151")),
    uTime: new THREE.Uniform(0),
  };

  const material = new CustomShaderMaterial({
    uniforms,
    baseMaterial: THREE.MeshStandardMaterial,
    fragmentShader: treeFragmentShader,
  });

  return material;
}
