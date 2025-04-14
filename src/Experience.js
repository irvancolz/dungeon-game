import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Light from "./Light";
import Debugger from "./Debugger";
import World from "./World/World";
import ResourcesLoader from "./Utils/ResourcesLoader";
import States from "./States";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    this.debug = new Debugger();
    this.states = new States();
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    this.camera = new Camera({
      scene: this.scene,
      sizes: this.states.sizes,
      canvas: this.canvas,
    });

    this.light = new Light({ scene: this.scene, debug: this.debug });

    this.renderer = new Renderer({
      scene: this.scene,
      sizes: this.states.sizes,
      canvas: this.canvas,
      camera: this.camera.instance,
    });

    this.resources = new ResourcesLoader([]);

    this.world = new World({ scene: this.scene });

    this.states.time.on("tick", () => {
      // on tick
      this.camera.update();
      this.renderer.update();
      this.world.update();
    });

    this.states.sizes.on("resize", () => {
      // on resize
      this.camera.resize();
      this.renderer.resize();
    });
  }
}
