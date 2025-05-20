import * as THREE from "three";
import woodVertexShader from "../Shaders/baseInstancedVert.glsl";
import singleVertexShader from "../Shaders/baseVertex.glsl";
import woodFragmentShader from "../Shaders/wood/fragment.glsl";

export default function WoodMaterial({
  color,
  noiseColor,
  instanced = true,
  alphaTexture = undefined,
}) {
  const useAlpha = alphaTexture != undefined;

  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color(color)),
    uNoiseColor: new THREE.Uniform(new THREE.Color(noiseColor)),
    uAphaTexture: new THREE.Uniform(alphaTexture),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: instanced ? woodVertexShader : singleVertexShader,
    fragmentShader: woodFragmentShader,
    uniforms,
    transparent: useAlpha,
    depthWrite: !useAlpha,
    side: THREE.DoubleSide,
    alphaTest: 0.99,
  });

  material.defines = {
    USE_ALPHA: useAlpha,
  };

  return material;
}
