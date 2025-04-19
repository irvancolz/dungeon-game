import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Light from "./Light";
import Debugger from "./Debugger";
import World from "./World/World";
import ResourcesLoader from "./Utils/ResourcesLoader";
import States from "./States";
import WorldPhysics from "./Physics/World";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;
    this.debugOpt = {
      showPhysics: false,
    };

    this.debug = new Debugger();
    this.states = new States();
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    this.addDebugger();

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

    this.resources = new ResourcesLoader([
      { path: "/player_2.glb", type: "gltfModel", name: "player" },
    ]);

    this.physics = new WorldPhysics();

    this.resources.on("finish:loaded", () => {
      this.world = new World({
        scene: this.scene,
        debug: this.debug,
        resources: this.resources.resources,
        physics: this.physics,
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

      if (this.world) {
        this.world.update();
      }

      if (this.debugOpt.showPhysics) {
        this.showPhysicsWorld();
      }
    });

    this.states.sizes.on("resize", () => {
      // on resize
      this.camera.resize();
      this.renderer.resize();
    });
  }

  addDebugger() {
    this.debug.ui.addBinding(this.debugOpt, "showPhysics");
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
  }
}
