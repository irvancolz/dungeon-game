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
import Backpack from "./Interface/Backpack/Backpack";
import backpackSeeds from "./Seeds/backpack.json";
import LootExpLlog from "./Interface/LootExpLog/LootExpLog";
import Controller from "./Utils/Controller";
import AnimationProvider from "./Utils/AnimationProvider";
import Stats from "three/examples/jsm/libs/stats.module.js";
import EventManager from "./World/EventManager";
import QuestManager from "./Interface/QuestManager/QuestManager";
import Quest from "./Interface/Quest/Quest";
import PlayerEvent from "./World/PlayerEvent";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    this.controller = new Controller();
    this.debug = new Debugger();
    this.states = new States(this.debug);
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    this.fog = new THREE.FogExp2("#565f67", 0.01);
    this.scene.fog = this.fog;

    this.backpack = new Backpack();
    this.backpack.init(backpackSeeds);

    this.lootExplog = new LootExpLlog();
    this.animationProvider = new AnimationProvider();
    this.eventManager = new EventManager();

    const quest = new Quest({
      title: "gather potion",
      dependencies: [],
      description: "find nearest potion around you to finish this quest",
      status: Quest.STATUS_IN_PROGRESS,
      objectives: [
        {
          type: PlayerEvent.EVENT_COLLECT,
          value: {
            id: "item001",
            name: "Potion of Minor Healing",
            count: 3,
          },
        },
      ],
    });
    this.questManager = new QuestManager();
    this.questManager.add(quest);

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
      fogColor: "#565f67",
    };
    this.addDebugger();

    this.camera = new Camera({
      scene: this.scene,
      sizes: this.states.sizes,
      canvas: this.canvas,
      playerPosition: this.states.playerPosition,
      debug: this.debug,
    });

    this.light = new Light({ scene: this.scene, debug: this.debug });

    this.renderer = new Renderer({
      scene: this.scene,
      sizes: this.states.sizes,
      canvas: this.canvas,
      camera: this.camera.instance,
    });

    this.composer = new Composer({
      renderer: this.renderer.instance,
      scene: this.scene,
      camera: this.camera.instance,
      size: this.states.sizes,
      debug: this.debug,
    });

    this.resources = new ResourcesLoader(resources);

    this.physics = new WorldPhysics();

    this.resources.on("finish:loaded", () => {
      this.animationProvider.addPlaylist(
        this.resources.resources.model_elandor.animations
      );

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
      if (this.stats) {
        this.stats.update();
      }
      this.showPhysicsWorld();
    });

    this.states.sizes.on("resize", () => {
      // on resize
      this.camera.resize();
      this.renderer.resize();
      // this.composer.resize();
    });

    this.controller.on("fullscreen", () => {
      document.body.requestFullscreen();
    });
  }

  addDebugger() {
    if (this.debug.active) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      this.debug.ui.addBinding(this.debugOpt, "showPhysics");

      const fogFolder = this.debug.ui.addFolder({
        title: "fog",
        expanded: false,
      });
      fogFolder.addBinding(this.debugOpt, "fogColor").on("change", (e) => {
        this.fog.color.set(this.debugOpt.fogColor);
      });
      fogFolder.addBinding(this.fog, "density", {
        min: 0.001,
        max: 0.1,
        step: 0.001,
      });
    }
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
