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
import Bushes from "./World/Bushes";
import Tree from "./World/Tree";
import LampPost from "./World/LampPost";
import Grass from "./World/Grass";
import WoodenBox from "./World/WoodenBox";

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

    // bushes
    const bushReff = refferencesProvider.getRefferences("Bushes");
    const bush = new Bushes({
      scales: bushReff.map((e) => e.scale),
      position: bushReff.map((e) => e.position),
      quaternion: bushReff.map((e) => e.quaternion),
      texture: refferencesAssets.resources.leaves_texture,
    });
    world.add(bush);

    // tree
    const treeReff = refferencesProvider.getRefferences("Bushes");
    const tree = new Tree({
      scales: treeReff.map((e) => e.scale),
      position: treeReff.map((e) => e.position),
      quaternion: treeReff.map((e) => e.quaternion),
      leaves: refferencesAssets.resources.leaves_texture,
      model: refferencesAssets.resources.model_tree,
    });
    world.add(tree);

    //lamppost
    const lamppostReff = refferencesProvider.getRefferences("LampPost");
    const lampPost = new LampPost({
      model: refferencesAssets.resources.model_lamp_post,
      texture: refferencesAssets.resources.lamppost_texture,
      position: lamppostReff.map((e) => e.position),
      quaternion: lamppostReff.map((e) => e.quaternion),
    });
    world.add(lampPost);

    // grass
    const grass = new Grass({
      density: 10,
      width: 10,
    });
    world.add(grass);

    // wooden box
    const woodBoxReff = refferencesProvider.getRefferences("ModelWoode");
    const woodBox = new WoodenBox({
      model: refferencesAssets.resources.model_wooden_box,
      alpha: refferencesAssets.resources.wooden_box_alpha_texture,
      position: woodBoxReff.map((e) => e.position),
      quaternion: woodBoxReff.map((e) => e.quaternion),
    });
    world.add(woodBox);

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
