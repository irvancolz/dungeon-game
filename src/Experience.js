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
import LootExpLlog from "./Interface/LootExpLog/LootExpLog";
import Controller from "./Utils/Controller";
import AnimationProvider from "./Utils/AnimationProvider";
import Stats from "three/examples/jsm/libs/stats.module.js";
import EventManager from "./World/EventManager";
import QuestManager from "./Interface/QuestManager/QuestManager";
import ItemReceiver from "./Interface/ItemReceiver/ItemReceiver";
import ControlsLegend from "./Interface/ControlsLegend/ControlsLegend";
import InformationPanel from "./Interface/InformationPanel/InformationPanel";
import ConversationManager from "./Interface/ConversationManager/ConversationManager";
import DropItemManager from "./Interface/DropItemManager";
import MarkersManager from "./Interface/MarkersManager";
import NPCManager from "./World/NPCManager";
import ItemDetail from "./Interface/ItemDetail/ItemDetail";
export default class Experience {
  constructor(canvas, world, quests = []) {
    this.canvas = canvas;
    this.world = world;
    this.quests = quests;

    this._initUtils();
    this._initPhysics();
    this._initInterface();
    this._init3DExperience();
    this._initQuest();
    this._initDebug();

    this.states.time.on("tick", () => {
      const palyerPos = this.states.getPlayerPosition();

      // on tick
      this.camera.update();
      this.renderer.update();
      // this.composer.update();
      if (this.physics) {
        this.physics.update();
      }
      if (this.world) {
        this.world.update();
      }
      if (this.stats) {
        this.stats.update();
      }
      if (this.debugOpt.showPhysics) {
        this._updatePhysicsDebugger();
      }
      if (this.dropManager) {
        this.dropManager.update(palyerPos);
      }
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

  _initDebug() {
    this.debugOpt = {
      showPhysics: false,
      showAxes: true,
      fogColor: "#565f67",
    };
    if (this.debug.active) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      this.debug.ui
        .addBinding(this.debugOpt, "showPhysics")
        .on("change", () => {
          this._updatePhysicsDebugger();
        });

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

    // physics
    this.debugPhysics = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
    );
    this.debugPhysics.frustumCulled = false;
    this.scene.add(this.debugPhysics);
  }

  _updatePhysicsDebugger() {
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

  _init3DExperience() {
    this.scene = new THREE.Scene();

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

    this.fog = new THREE.FogExp2("#565f67", 0.01);
    this.scene.fog = this.fog;

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

    this.dropManager = new DropItemManager();
    this.dropManager.setScene(this.scene);

    this.markers = new MarkersManager();
    this.npc = new NPCManager();
    this.npc.setScene(this.scene);
  }

  _initInterface() {
    this.backpack = new Backpack();
    this.lootExplog = new LootExpLlog();
    this.itemReceiver = new ItemReceiver();
    this.itemDetal = new ItemDetail();
    this.controlsLegend = new ControlsLegend();
    this.informationPanel = new InformationPanel();
  }

  _initUtils() {
    this.controller = new Controller();
    this.debug = new Debugger();
    this.states = new States(this.debug);
    this.eventManager = new EventManager();
    this.animationProvider = new AnimationProvider();
    this.chat = new ConversationManager();
  }

  _initQuest() {
    this.questManager = new QuestManager(this.quests);
  }
  _initPhysics() {
    this.physics = new WorldPhysics();
    this.physics.init();
  }
  _initWorld() {
    this.world = new World({
      scene: this.scene,
      debug: this.debug,
      resources: this.resources.resources,
      physics: this.physics,
      states: this.states,
    });
  }

  setResources(src) {
    this.resources = src;
  }

  setWorld(world) {
    this.world = world;

    // restart the physics world too...?
    this.physics.dispose();
    this.physics.init();

    this.init();
  }

  setNPCAnimations(anim) {
    this.animationProvider.addPlaylist(anim);
  }

  setNPC(npcs) {
    this.npc.addNPC(npcs);
  }

  init() {
    this.npc.setResources(this.resources);
    this.npc.init();
    this.itemDetal.setResources(this.resources);

    // setup world
    this.world.setPhysics(this.physics);
    this.world.setScene(this.scene);
    this.world.setResources(this.resources);
    this.world.setStates(this.states);
    this.world.setDebugger(this.debug);
    this.world.add(...this.npc.members);
    this.world.init();

    //quest
    this.questManager.init();
  }

  addQuest(quest) {
    this.questManager.add(quest);
  }

  fillBackpack(items) {
    this.backpack.init(items);
  }

  addDrops(drops = []) {
    for (let i = 0; i < drops.length; i++) {
      let model;
      const reff = drops[i].model;
      if (reff) {
        model = this.resources[reff].scene;
      }
      this.dropManager.add(drops[i], model);
    }
  }
}
