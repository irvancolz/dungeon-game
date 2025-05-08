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
import EmissiveMaterial from "../Materials/Emissive";

export default class World {
  constructor({ scene, debug, resources, physics, states }) {
    this.scene = scene;
    this.debug = debug;
    this.resources = resources;
    this.map = resources.village_map;
    this.physics = physics;
    this.states = states;
    this.width = 256;

    this.floor = new DebugFloor({
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      width: this.width,
    });

    this.addFences();
    this.addHouse();
    this.addPlayer();
    this.addBushes();
    this.addTree();
    this.addTrunks();
  }

  update(elapsed, delta) {
    this.player.update();
    this.bushes.update(elapsed);
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
    });
  }

  addBushes() {
    const bushesRefs = this.map.scene.children.filter((i) => {
      return i.name.startsWith("Bushes");
    });

    const positionRefs = bushesRefs.map((i) => i.position);
    const rotationRefs = bushesRefs.map((i) => i.quaternion);
    const scaleRefs = bushesRefs.map((i) => i.scale);

    this.bushes = new Bushes({
      position: positionRefs,
      quaternion: rotationRefs,
      scene: this.scene,
      texture: this.resources.leaves_texture,
      debug: this.debug,
      scales: scaleRefs,
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

  dispose() {
    this.graves.dispose();
    this.player.dispose();
  }
}
