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

    // this.floor = new DebugFloor({
    //   scene: this.scene,
    //   debug: this.debug,
    //   physics: this.physics,
    //   width: this.width,
    //   texture: this.resources.ground_texture,
    // });
    this.floor = new Ground({
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      width: this.width,
      texture: this.resources.ground_texture,
      maxHeight: 0,
    });

    // this.addGrass();
    this.addPlayer();
    this.addFences();
    // this.addHouse();
    // this.addBushes();
    // this.addTree();
    // this.addTrunks();
    this.addWoodenBoxes();
  }

  update(elapsed, delta) {
    this.player.update();
    this.marker.update(this.states.playerPosition.getState());
    // this.bushes.update(elapsed);
    // this.tree.update(elapsed);
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
    const pos = positionRefs[0].clone();

    this.marker = new Marker({
      scene: this.scene,
      position: pos,
      parent: this.woodenBoxes.mesh,
      debug: this.debug,
      label: "box lorem ipsum dolor sit amet",
    });

    this.marker.on("interact", () => {
      this.camera.focus(pos);

      this.chat.initConversation([
        { author: "Customer", chat: "Hi, is my laundry ready yet?" },
        {
          author: "Staff",
          chat: "Hello! Let me check your order. Can I have your order ID?",
        },
        { author: "Customer", chat: "Sure, it's ORD123456." },
        {
          author: "Staff",
          chat: "Thanks! It looks like your laundry is still being ironed. It should be ready in about 30 minutes.",
        },
        { author: "Customer", chat: "Great, I’ll come by later then. Thanks!" },
        { author: "Staff", chat: "You're welcome! See you soon." },
      ]);

      this.chat.on("chat:ended", () => {
        this.camera.focusPlayer();
      });
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

  addLampPost() {
    const lampRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("LampPost");
    });

    const positionRefs = lampRefs.map((i) => i.position);
    const rotationRefs = lampRefs.map((i) => i.quaternion);

    this.lampPost = new LampPost({
      model: this.resources.model_lamp_post,
      scene: this.scene,
      debug: this.debug,
      position: positionRefs,
      quaternion: rotationRefs,
    });
  }

  addGrass() {
    this.grass = new Grass({
      size: 400,
      debug: this.debug,
      fieldSize: this.width,
      radius: this.width / 2,
      groundTexture: this.resources.ground_texture,
      scene: this.scene,
    });
  }

  dispose() {
    this.graves.dispose();
    this.player.dispose();
  }
}
