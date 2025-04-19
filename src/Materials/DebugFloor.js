import * as THREE from "three";
import debugFloorVertexShader from "../Shaders/baseVertex.glsl";
import debugFloorFragmentShader from "../Shaders/DebugFloor/fragment.glsl";

export default function DebugFloorMaterial() {
  const uniforms = {
    uSize: new THREE.Uniform(50),
    uLineWidth: new THREE.Uniform(0.001),
    uBoardColor: new THREE.Uniform(new THREE.Color("#1b1b1b")),
    uLineColor: new THREE.Uniform(new THREE.Color("#ffffff")),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: debugFloorVertexShader,
    fragmentShader: debugFloorFragmentShader,
    side: THREE.DoubleSide,
    uniforms,
  });

  return material;
}
