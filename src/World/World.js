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

export default class World {
  constructor({ scene, debug, resources, physics, states }) {
    this.scene = scene;
    this.debug = debug;
    this.resources = resources;
    this.map = resources.village_map;
    this.physics = physics;
    this.states = states;
    this.width = 128;

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
    this.addHouse();
    this.addBushes();
    this.addTree();
    this.addTrunks();
  }

  update(elapsed, delta) {
    this.player.update();
    // this.grass.update(this.states.playerPosition.getState());
    // this.bushes.update(elapsed);
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
      model: this.resources.model_bushes,
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
