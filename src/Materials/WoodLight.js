import WoodMaterial from "./Wood";

export default function WoodLightMaterial(instanced, alphaTexture) {
  return WoodMaterial({
    color: "#765430",
    noiseColor: "#66420c",
    instanced,
    alphaTexture,
  });
}
