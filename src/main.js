import Experience from "./Experience";
import "./index.scss";
import World from "./World/World";
import ResourcesLoader from "./Utils/ResourcesLoader";
import RefferenceProvider from "./Utils/RefferenceProvider";
import resources from "./resources";
import DebugFloor from "./World/DebugFloor";
import Ground from "./World/Ground";
import Fence from "./World/Fence";
import House from "./World/House";

const canvas = document.getElementById("canvas");

const refferencesAssets = new ResourcesLoader(resources);

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

    // floor
    const floor = new Ground({
      texture: refferencesAssets.resources.ground_texture,
      width: 124,
    });
    // const floor = new DebugFloor({ width: 124 });
    world.setFloor(floor);

    // fences
    const fencesReff = refferencesProvider.getRefferences("ModelFence");
    const fences = new Fence({
      model: refferencesAssets.resources.model_fence_wooden,
      position: fencesReff.map((e) => e.position),
      quaternion: fencesReff.map((e) => e.quaternion),
    });
    world.add(fences);

    // houses
    const houseReff = refferencesProvider.getRefferences("House");
    const house = new House({
      model: refferencesAssets.resources.model_house,
      texture: refferencesAssets.resources.house_texture,
      position: houseReff.map((e) => e.position),
      quaternion: houseReff.map((e) => e.quaternion),
    });
    world.add(house);

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
