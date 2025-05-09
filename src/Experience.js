import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Light from "./Light";
import Debugger from "./Debugger";
import World from "./World/World";
import ResourcesLoader from "./Utils/ResourcesLoader";
import States from "./States";
import WorldPhysics from "./Physics/World";
import resources from "./resources";
import Composer from "./Composer";
import ChatBuble from "./ChatBuble";

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
    this.chat = new ChatBuble();

    // background
    const path = "texture/background/";
    const format = ".png";
    const urls = [
      path + "px" + format,
      path + "nx" + format,
      path + "py" + format,
      path + "ny" + format,
      path + "pz" + format,
      path + "nz" + format,
    ];

    const background = new THREE.CubeTextureLoader().load(urls);
    background.mapping = THREE.CubeRefractionMapping;

    this.scene.background = background;

    this.debugOpt = {
      showPhysics: false,
      showAxes: true,
    };
    this.addDebugger();

    this.camera = new Camera({
      scene: this.scene,
      sizes: this.states.sizes,
      canvas: this.canvas,
      playerPosition: this.states.playerPosition,
      target: this.states.playerTarget,
      debug: this.debug,
    });

    this.light = new Light({ scene: this.scene, debug: this.debug });

    this.renderer = new Renderer({
      scene: this.scene,
      sizes: this.states.sizes,
      canvas: this.canvas,
      camera: this.camera.instance,
    });

    // this.composer = new Composer({
    //   renderer: this.renderer.instance,
    //   scene: this.scene,
    //   camera: this.camera.instance,
    //   size: this.states.sizes,
    //   debug: this.debug,
    // });

    this.resources = new ResourcesLoader(resources);

    this.physics = new WorldPhysics();

    this.resources.on("finish:loaded", () => {
      this.world = new World({
        scene: this.scene,
        debug: this.debug,
        resources: this.resources.resources,
        physics: this.physics,
        states: this.states,
      });
    });

    this.debugPhysics = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
    );
    this.debugPhysics.frustumCulled = false;
    this.scene.add(this.debugPhysics);

    this.states.time.on("tick", () => {
      // on tick
      this.camera.update();
      this.renderer.update();
      this.physics.update();
      // this.composer.update();

      if (this.world) {
        this.world.update(this.states.time.elapsed, this.states.time.delta);
      }

      this.showPhysicsWorld();
    });

    this.states.sizes.on("resize", () => {
      // on resize
      this.camera.resize();
      this.renderer.resize();
      // this.composer.resize();
    });
  }

  addDebugger() {
    if (this.debug.active) {
      this.debug.ui.addBinding(this.debugOpt, "showPhysics");
      this.debug.ui.addBinding(this.debugOpt, "showAxes");
    }

    const gridHelper = new THREE.AxesHelper();
    gridHelper.visible = this.debugOpt.showAxes;
    this.scene.add(gridHelper);
  }

  showPhysicsWorld() {
    const { vertices, colors } = this.physics.world.debugRender();
    this.debugPhysics.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    this.debugPhysics.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 4)
    );
    this.debugPhysics.visible = this.debugOpt.showPhysics;
  }
}
