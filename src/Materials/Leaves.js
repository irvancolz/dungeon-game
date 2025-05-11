import * as THREE from "three";
import leavesVertexShader from "../Shaders/leaves/vertex.glsl";
import leavesFragmentShader from "../Shaders/leaves/fragment.glsl";

export default function LeavesMaterial() {
  const uniforms = {
    uLeavesTexture: new THREE.Uniform(),
    uLeavesColor: new THREE.Uniform(new THREE.Color("#113111")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: leavesVertexShader,
    fragmentShader: leavesFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  return material;
}
