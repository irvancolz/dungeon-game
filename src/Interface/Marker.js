import * as THREE from "three";
import vertexShader from "../Shaders/markers/vertex.glsl";
import fragmentShader from "../Shaders/markers/fragment.glsl";
import EventEmitter from "../Utils/EventEmitter";
import Button from "./Button/Button";
import gsap from "gsap";

class Marker extends EventEmitter {
  constructor({ scene, position, parent, debug, label, radius }) {
    super();
    this.offset = new THREE.Vector3(0, 0.5, 0);
    this.scene = scene;
    this.position = position;
    this.parent = parent.clone();
    this.debug = debug;
    this.label = label;
    this.radius = radius;

    this.init();
    if (debug) {
      this.addDebug();
    }
  }

  addDebug() {
    if (!this.debug.active) return;

    const f = this.debug.ui.addFolder({ title: "marker", expanded: true });
    f.addBinding(this.material.uniforms.uBorderWidth, "value", {
      min: 0,
      max: 0.5,
      step: 0.01,
      label: "ring tresshold",
    });
    f.addBinding(this.material.uniforms.uClearProgress, "value", {
      min: 0,
      max: 1.5,
      step: 0.01,
      label: "dissapear tresshold",
    });
    f.addBinding(this.material.uniforms.uCenterWidth, "value", {
      min: 0,
      max: 0.5,
      step: 0.01,
      label: "center tresshold",
    });
  }

  initButton() {
    this.button = new Button({
      position: this.position,
      label: this.label,
      radius: this.radius,
    });
    this.button.on("select", () => {
      this.trigger("interact");
    });
  }

  initMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uCenter: new THREE.Uniform(this.position),
        uBorderWidth: new THREE.Uniform(0.3),
        uCenterWidth: new THREE.Uniform(0.15),
        uClearProgress: new THREE.Uniform(1.5),
      },
    });
  }

  initGeometry() {
    const size = 0.5;
    this.geometry = new THREE.PlaneGeometry(size, size);
    this.geometry.rotateZ(Math.PI * 0.25);
  }

  initMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    const box3 = new THREE.Box3();
    box3.expandByObject(this.parent);
    this.dimension = new THREE.Vector3();
    box3.getSize(this.dimension);
    this._updatePosition();
  }

  _updatePosition() {
    this.mesh.position
      .copy(this.position)
      .add(this.offset)
      .add({ x: 0, y: this.dimension.y, z: 0 });
  }

  init() {
    this.initButton();
    this.initGeometry();
    this.initMaterial();
    this.initMesh();

    this.scene.add(this.mesh);
  }

  update(player) {
    this.button.update(player);
  }

  dispose() {
    this.button.dispose();
    gsap.to(this.material.uniforms.uClearProgress, {
      value: 0,
      duration: 1,
      onComplete: () => {
        this.scene.remove(this.mesh);
        this.material.dispose();
        this.geometry.dispose();
        this.trigger("dispose");
      },
    });
  }
  addOffset(sum) {
    this.offset.add(sum);
    this._updatePosition();
  }
}

export default Marker;
