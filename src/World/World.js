import DebugFloor from "./DebugFloor";
import Graves from "./Graves";
import Player from "./Player";
import Ground from "./Ground";
import Grass from "./Grass";
import Trunk from "./Trunk";
import * as THREE from "three";
import Fence from "./Fence";
export default class World {
  constructor({ scene, debug, resources, physics, states }) {
    this.scene = scene;
    this.debug = debug;
    this.resources = resources;
    this.map = resources.village_map;
    this.physics = physics;
    this.states = states;
    this.width = 256;
    this.maxHeight = 0.58;

    this.addFences();
    this.addPlayer();

    this.floor = new DebugFloor({
      scene: this.scene,
      debug: this.debug,
      physics: this.physics,
      width: this.width,
    });

    // this.trunk = new Trunk({
    //   scene: this.scene,
    //   model: this.resources.trunk_1,
    //   physics: this.physics,
    //   position: new THREE.Vector3(0, 0, 1),
    // });

    // this.ground = new Ground({
    //   scene: this.scene,
    //   debug: this.debug,
    //   texture: this.resources.cemeteryTexture,
    //   size: this.width,
    //   physics: this.physics,
    //   maxHeight: this.maxHeight,
    // });

    // this.grass = new Grass({
    //   size: 300,
    //   radius: this.width * 0.5,
    //   scene: this.scene,
    //   debug: this.debug,
    //   states: this.states,
    //   resources: this.resources,
    //   fieldSize: this.width,
    //   groundHeight: this.maxHeight,
    // });

    // this.addGraves();
  }

  update() {
    this.player.update();
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
