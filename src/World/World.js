import DebugFloor from "./DebugFloor";
import Graves from "./Graves";
import Player from "./Player";
import Ground from "./Ground";
import Grass from "./Grass";
import Trunk from "./Trunk";
import * as THREE from "three";
import Fence from "./Fence";
import House from "./House";
import Bushes from "./Bushes";
import Tree from "./Tree";
import LampPost from "./LampPost";
import WoodenBox from "./WoodenBox";
import ChatBuble from "../Interface/ChatBuble/ChatBuble";
import Marker from "../Interface/Marker";
import Camera from "../Camera";
import Backpack from "../Interface/Backpack/Backpack";
import DropItem from "../Utils/DropItem";
import DropItemManager from "../Interface/DropItemManager";
import backpackSeeds from "../Seeds/backpack.json";
import MarkersManager from "../Interface/MarkersManager";
import { items } from "../Backend/items";
import Human from "./Human";
import NPCManager from "./NPCManager";
import NPCInformation from "../Seeds/NPC";
import QuestManager from "../Interface/QuestManager/QuestManager";
import hello_world from "../Seeds/quests/hello_world";
import ItemReceiver from "../Interface/ItemReceiver/ItemReceiver";

export default class World {
  constructor({ scene, debug, resources, physics, states }) {
    this.scene = scene;
    this.debug = debug;
    this.resources = resources;
    this.map = resources.village_map;
    this.physics = physics;
    this.states = states;
    this.width = 128;
    this.camera = new Camera({});

    this.chat = new ChatBuble();
    this.backpack = new Backpack();
    const itemReceiver = ItemReceiver.getInstance();
    this.backpack.setSecondaryInterface(itemReceiver);

    this.dropManager = new DropItemManager();
    this.dropManager.setScene(this.scene);
    this.dropManager.setTexture(this.resources.drops_alpha_texture);

    const seed = [];
    for (let i = 0; i < backpackSeeds.length; i++) {
      const pos = new THREE.Vector3(i * 5, 0, i * 2);
      const item = { ...backpackSeeds[i], position: pos };
      seed.push(item);
    }
    this.dropManager.init([]);

    this.markers = new MarkersManager();
    this.npc = new NPCManager();

    this.floor = new DebugFloor({
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      width: this.width,
      texture: this.resources.ground_texture,
    });

    // this.floor = new Ground({
    //   scene: this.scene,
    //   debug: this.debug,
    //   physics: this.physics,
    //   width: this.width,
    //   texture: this.resources.ground_texture,
    // });

    this.addFences();
    this.addPlayer();
    // this.addBushes();
    // this.addTree();
    // this.addHouse();
    // this.addLampPost();
    // this.addTrunks();
    // this.addWoodenBoxes();
    this.addNPC();
    // this.addGrass();

    this.questManager = QuestManager.getInstance();
    this.questManager.add(hello_world);
  }

  update(elapsed, delta) {
    const playerPosition = this.states.playerPosition.getState();
    const playerDirection = this.states.playerDirection.getState();

    if (this.player) {
      this.player.update();
    }
    if (this.dropManager) {
      this.dropManager.update(playerPosition);
    }
    if (this.markers) {
      this.markers.update(playerPosition);
    }
    if (this.grass) {
      this.grass.update(elapsed, playerPosition, playerDirection);
    }
    if (this.bushes) {
      this.bushes.update(elapsed);
    }
    if (this.tree) {
      this.tree.update(elapsed);
    }
    if (this.npc) {
      this.npc.update(delta);
    }
  }

  addNPC() {
    const npcRef = this.map.scene.children.filter((i) => {
      return i.name.startsWith("NPC");
    });

    npcRef.forEach((npc) => {
      const name = npc.name.split("_");
      name.splice(0, 1);

      const info = NPCInformation.getDetail(name.join("_"));

      const person = new Human({
        scene: this.scene,
        model: this.resources[info.model],
        name: info.name,
        position: npc.position,
        quaternion: npc.quaternion,
        job: info.job,
      });
      this.npc.addNPC(person);
    });
  }

  addHouse() {
    const housesRef = this.map.scene.children.filter((i) => {
      return i.name.startsWith("House");
    });

    const positionRefs = housesRef.map((i) => i.position);
    const rotationRefs = housesRef.map((i) => i.quaternion);

    this.house = new House({
      scene: this.scene,
      model: this.resources.model_house,
      position: positionRefs,
      quaternion: rotationRefs,
      physics: this.physics,
      debug: this.debug,
      roofTexture: this.resources.roof_texture,
      texture: this.resources.house_texture,
    });
  }

  addPlayer() {
    const playerRef = this.map.scene.children.find((i) => {
      return i.name.startsWith("Player");
    });

    this.states.playerPosition.setState(playerRef.position);
    this.player = new Player({
      scene: this.scene,
      model: this.resources.player,
      physics: this.physics,
      debug: this.debug,
      states: this.states,
    });
  }

  addFences() {
    const fenceRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("ModelFence");
    });

    const positionRefs = fenceRefs.map((i) => i.position);
    const rotationRefs = fenceRefs.map((i) => i.quaternion);

    this.fences = new Fence({
      model: this.resources.model_fence_wooden,
      scene: this.scene,
      position: positionRefs,
      quaternion: rotationRefs,
      physics: this.physics,
      debug: this.debug,
    });
  }

  addBushes() {
    const bushesRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("Bushes");
    });

    const positionRefs = bushesRefs.map((i) => i.position);
    const scaleRefs = bushesRefs.map((i) => i.scale);

    this.bushes = new Bushes({
      position: positionRefs,
      scene: this.scene,
      texture: this.resources.leaves_texture,
      debug: this.debug,
      scales: scaleRefs,
      matcap: this.resources.bushes_matcap_texture,
    });
  }

  addTrunks() {
    const trunkRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("Trunk");
    });

    const positionRefs = trunkRefs.map((i) => i.position);
    const rotationRefs = trunkRefs.map((i) => i.quaternion);

    this.trunks = new Trunk({
      position: positionRefs,
      quaternion: rotationRefs,
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      model: this.resources.model_trunk,
      noiseTexture: this.resources.noise_texture,
    });
  }

  addTree() {
    const bushesRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("Tree");
    });

    const positionRefs = bushesRefs.map((i) => i.position);
    const rotationRefs = bushesRefs.map((i) => i.quaternion);

    this.tree = new Tree({
      position: positionRefs,
      quaternion: rotationRefs,
      scene: this.scene,
      model: this.resources.model_tree,
      debug: this.debug,
      physicsWorld: this.physics,
      leaves: this.resources.leaves_texture,
      leavesMatcap: this.resources.bushes_matcap_texture,
    });
  }

  addWoodenBoxes() {
    const woodenBoxesref = this.map.scene.children.filter((i) => {
      return i.name.startsWith("ModelWoodenBox");
    });

    const positionRefs = woodenBoxesref.map((i) => i.position);
    const rotationRefs = woodenBoxesref.map((i) => i.quaternion);

    this.woodenBoxes = new WoodenBox({
      model: this.resources.model_wooden_box,
      debug: this.debug,
      physics: this.physics,
      position: positionRefs,
      quaternion: rotationRefs,
      scene: this.scene,
      alpha: this.resources.wooden_box_alpha_texture,
    });
  }

  // update in future
  addGraves() {
    this.gravesRef = this.map.scene.children.filter((i) => {
      return i.name.startsWith("Grave");
    });

    this.graves = new Graves({
      positions: this.gravesRef.map((i) => i.position),
      model: this.resources.grave,
      scene: this.scene,
      debug: this.debug,
    });
  }

  addGrass() {
    this.grass = new Grass({
      density: 10,
      debug: this.debug,
      width: 10,
      scene: this.scene,
      position: new THREE.Vector3(0, 0, 0),
    });
  }
  addLampPost() {
    const lampRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("LampPost");
    });

    const positionRefs = lampRefs.map((i) => i.position);
    const rotationRefs = lampRefs.map((i) => i.quaternion);

    this.lampPost = new LampPost({
      scene: this.scene,
      debug: this.debug,
      position: positionRefs,
      quaternion: rotationRefs,
      model: this.resources.model_lamp_post,
      texture: this.resources.lamppost_texture,
    });
  }

  dispose() {
    this.graves.dispose();
    this.player.dispose();
  }
}
