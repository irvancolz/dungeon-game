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

    this.dropManager = new DropItemManager();
    this.dropManager.setScene(this.scene);
    this.dropManager.setTexture(this.resources.drops_alpha_texture);

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
    // this.addNPC();
    // this.addGrass();
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
    const box = this.resources.model_zombie.scene.clone();

    const npc1Pos = new THREE.Vector3(0, 0, 0);
    const npc1 = new Human({
      position: npc1Pos,
      model: this.resources.model_zombie_2,
      name: "old man",
      scene: this.scene,
      quaternion: new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      ),
    });
    this.npc.addNPC(npc1);

    const npc2Pos = new THREE.Vector3(2, 0, 0);
    const npc2 = new Human({
      position: npc2Pos,
      model: this.resources.model_zombie,
      name: "zombie 2",
      scene: this.scene,
      quaternion: new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      ),
    });

    const npc1Marker = new Marker({
      scene: this.scene,
      label: npc1.name,
      parent: box,
      position: npc1Pos,
      radius: 6,
    });

    npc1Marker.on("interact", () => {
      this.camera.focus(npc1Pos);
      const chatId = this.chat.initConversation([
        {
          author: "Traveler",
          chat: "Excuse me, sir. Do you know where the nearest village is?",
        },
        {
          author: "Old Man",
          chat: "Ah, you're a bit off the trail, young one. The village lies just beyond the grove to the east.",
        },
        {
          author: "Traveler",
          chat: "Thank you kindly. It's been a long walk, and I'm running low on food.",
        },
        {
          author: "Old Man",
          chat: "I see. Here, take these apples from my satchel. They're fresh and sweet—just picked this morning.",
        },
        {
          author: "Traveler",
          chat: "Really? That's very generous of you. Are you sure?",
        },
        {
          author: "Old Man",
          chat: "Of course. A traveler should never go hungry on the road. Besides, kindness has a way of circling back.",
        },
        {
          author: "Traveler",
          chat: "Thank you, sir. I won’t forget this. I hope to repay your kindness one day.",
        },
        {
          author: "Old Man",
          chat: "No need. Just pass it on when you can. Safe travels, young one.",
        },
      ]);

      this.chat.on("chat:ended", () => {
        npc1Marker.dispose();
        this.camera.focusPlayer();
        const apples = items.toBackpackItem("item007");
        this.backpack.insert(apples, 3);
      });
    });

    this.markers.add(npc1Marker);

    this.npc.addNPC(npc2);
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
