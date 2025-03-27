import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Light from "./Light";
import Debugger from "./Debugger";
import World from "./World/World";
import ResourcesLoader from "./Utils/ResourcesLoader";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    this.debug = new Debugger();

    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.light = new Light();
    this.renderer = new Renderer();
    this.resources = new ResourcesLoader([]);
    this.world = new World();

    this.time.on("tick", () => {
      // on tick
      this.camera.update();
      this.renderer.update();
      this.world.update();
    });

    this.sizes.on("resize", () => {
      // on resize
      this.camera.resize();
      this.renderer.resize();
    });
  }
}
