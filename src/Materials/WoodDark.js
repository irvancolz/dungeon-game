import WoodMaterial from "./Wood";

export default function WoodDarkMaterial(instanced, alphaTexture) {
  return WoodMaterial({
    color: "#2e2311",
    noiseColor: "#312819",
    instanced,
    alphaTexture,
  });
}
