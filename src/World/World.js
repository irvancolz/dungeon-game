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
import Human from "./Human";
import NPCInformation from "../Seeds/NPC";

export default class World {
  constructor() {
    // every object in world
    this.environments = [];

    // this.floor = new Ground({
    //   scene: this.scene,
    //   debug: this.debug,
    //   physics: this.physics,
    //   width: this.width,
    //   texture: this.resources.ground_texture,
    // });
  }

  // _initFloor() {
  //   this.floor = new DebugFloor({
  //     scene: this.scene,
  //     debug: this.debug,
  //     physics: this.physics,
  //     width: this.width,
  //   });
  // }
  setFloor(floor) {
    if (this.floor) {
      this.floor.dispose();
    }
    this.floor = floor;
    if (this.physics && this.scene && this.debug) {
      this.floor.setPhysics(this.physics);
      this.floor.setScene(this.scene);
      this.floor.setDebugger(this.debug);
    }
  }
  init() {
    this.floor.init();
    this.environments.forEach((obj) => {
      if (obj.setScene) {
        obj.setScene(this.scene);
      }
      if (obj.setDebugger) {
        obj.setDebugger(this.debug);
      }
      if (obj.setPhysics) {
        obj.setPhysics(this.physics);
      }
      if (obj.setStates) {
        obj.setStates(this.states);
      }
      obj.init();
    });
  }

  add(item) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
    } else {
      this.environments.push(item);
    }
  }

  getPlayerPos() {
    return this.states.playerPosition.getState();
  }

  getElapsed() {
    return this.states.time.elapsed;
  }
  getDelta() {
    return this.states.time.delta;
  }

  setPhysics(phsc) {
    this.physics = phsc;
    this.floor.setPhysics(this.physics);
  }

  setStates(state) {
    this.states = state;
  }

  setScene(scene) {
    this.scene = scene;
    this.floor.setScene(this.scene);
  }

  setDebugger(debug) {
    this.debug = debug;
    this.floor.setDebugger(this.debug);
  }

  setResources(src) {
    this.resources = src;
  }

  update(elapsed, delta) {
    // const playerPosition = this.states.playerPosition.getState();
    // const playerDirection = this.states.playerDirection.getState();
    // if (this.player) {
    //   this.player.update();
    // }
    // if (this.dropManager) {
    //   this.dropManager.update(playerPosition);
    // }
    // if (this.markers) {
    //   this.markers.update(playerPosition);
    // }
    // if (this.grass) {
    //   this.grass.update(playerPosition);
    // }
    // if (this.bushes) {
    //   this.bushes.update(elapsed);
    // }
    // if (this.tree) {
    //   this.tree.update(elapsed);
    // }
    // if (this.npc) {
    //   this.npc.update(delta);
    // }
  }

  dispose() {
    // this.graves.dispose();
    // this.player.dispose();
  }

  // ====================
  // addNPC() {
  //   const npcRef = this.map.scene.children.filter((i) => {
  //     return i.name.startsWith("NPC");
  //   });

  //   npcRef.forEach((npc) => {
  //     const name = npc.name.split("_");
  //     name.splice(0, 1);

  //     const info = NPCInformation.getDetail(name.join("_"));

  //     const person = new Human({
  //       scene: this.scene,
  //       model: this.resources[info.model],
  //       name: info.name,
  //       position: npc.position,
  //       quaternion: npc.quaternion,
  //       job: info.job,
  //     });
  //     this.npc.addNPC(person);
  //   });
  // }

  // addHouse() {
  //   const housesRef = this.map.scene.children.filter((i) => {
  //     return i.name.startsWith("House");
  //   });

  //   const positionRefs = housesRef.map((i) => i.position);
  //   const rotationRefs = housesRef.map((i) => i.quaternion);

  //   this.house = new House({
  //     scene: this.scene,
  //     model: this.resources.model_house,
  //     position: positionRefs,
  //     quaternion: rotationRefs,
  //     physics: this.physics,
  //     debug: this.debug,
  //     roofTexture: this.resources.roof_texture,
  //     texture: this.resources.house_texture,
  //   });
  // }

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

  // addFences() {
  //   const fenceRefs = this.map.scene.children.filter((i) => {
  //     return i.name.startsWith("ModelFence");
  //   });

  //   const positionRefs = fenceRefs.map((i) => i.position);
  //   const rotationRefs = fenceRefs.map((i) => i.quaternion);

  //   this.fences = new Fence({
  //     model: this.resources.model_fence_wooden,
  //     scene: this.scene,
  //     position: positionRefs,
  //     quaternion: rotationRefs,
  //     physics: this.physics,
  //     debug: this.debug,
  //   });
  // }

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
}
