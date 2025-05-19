import WoodMaterial from "./Wood";

export default function WoodLightMaterial(instanced, alphaTexture) {
  return WoodMaterial({
    color: "#6e4e2f",
    noiseColor: "#876949",
    instanced,
    alphaTexture,
  });
}
