import * as THREE from "three";

export default function BushesMaterial(matcap, alpha) {
  const uniforms = {
    uLeavesTexture: new THREE.Uniform(),
    uMatcapTexture: new THREE.Uniform(),
    uLeavesColor: new THREE.Uniform(new THREE.Color("#113111")),
    uTime: new THREE.Uniform(0),
  };

  const material = new THREE.MeshMatcapMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    matcap,
    alphaMap: alpha,
    polygonOffset: true,
    polygonOffsetUnits: 1,
    polygonOffsetFactor: 1,
  });

  return material;
}
