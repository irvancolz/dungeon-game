import { GLTFLoader } from "three/examples/jsm/Addons.js";
import Experience from "./Experience";
import "./index.scss";
import World from "./World/World";
import ResourcesLoader from "./Utils/ResourcesLoader";
import RefferenceProvider from "./Utils/RefferenceProvider";
import resources from "./resources";
import DebugFloor from "./World/DebugFloor";

const canvas = document.getElementById("canvas");

const refferencesAssets = new ResourcesLoader([
  {
    path: "/model/village_map.glb",
    type: "gltfModel",
    name: "village_map",
  },
]);

refferencesAssets.on("finish:loaded", () => {
  startGame();
});

function startGame() {
  const refferencesProvider = new RefferenceProvider(
    refferencesAssets.resources.village_map.scene.children
  );

  const assets = new ResourcesLoader(resources);
  assets.on("finish:loaded", () => {
    const world = new World();

    const debugFloor = new DebugFloor({ width: 124 });
    world.setFloor(debugFloor);

    const experience = new Experience(canvas, world);
    experience.setResources(assets.resources);
    experience.setNPCAnimations(assets.resources.model_elandor.animations);

    const npcReffs = refferencesProvider.getRefferences("NPC");
    npcReffs.forEach((npc) => {
      experience.setNPC(npc);
    });

    experience.init();

    window.experience = experience;
  });
}
