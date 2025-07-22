import ChatBuble from "../Interface/ChatBuble/ChatBuble";
import AnimationProvider from "../Utils/AnimationProvider";
import Canvas from "../Utils/Canvas";
import EventEmitter from "../Utils/EventEmitter";
import * as THREE from "three";
import EventManager from "./EventManager";
import PlayerEvent from "./PlayerEvent";
import Button from "../Interface/Button/Button";
import States from "../States";

class Human extends EventEmitter {
  #STATE_IDLE = "idle";
  #STATE_TALK = "talk";
  #STATE_WALK = "walk";
  constructor({ scene, model, position, name = "", quaternion, job = "" }) {
    super();
    this.type = "human";
    this.scene = scene;
    this.name = name;
    this.job = job;
    this.model = model;
    this.character = this.model.scene.children[0];
    this.position = position;
    this.quaternion = quaternion;
    this.state = this.#STATE_IDLE;
    this.animationProvider = new AnimationProvider();
    this.eventManager = EventManager.getInstance();
    this.states = States.getInstance();

    this._init();
  }

  _init() {
    this.character.position.copy(this.position);
    this.character.quaternion.copy(this.quaternion);

    this._initChat();
    this._initNameTag();
    this._initMixer();
    this._initAnimation();
    this._updateAnimationState();

    this.scene.add(this.character);
  }

  _initChat() {
    this.conversation = [];
    this.chat = ChatBuble.getInstance();
  }
  update(delta) {
    this.mixer.update(delta * 0.001);
    if (this.button) {
      this.button.update(this.states.getPlayerPosition());
    }
  }

  _initNameTag() {
    this.canvas = new Canvas();
    this.canvas.write(this.name);

    if (this.job) this.canvas.write(`< ${this.job} >`);

    const offset = new THREE.Vector3(0, 0.5, 0);

    this.nameTag = new THREE.Sprite(
      new THREE.SpriteMaterial({
        alphaMap: new THREE.CanvasTexture(this.canvas.canvas),
        depthWrite: false,
      })
    );

    const box3 = new THREE.Box3();
    box3.expandByObject(this.character.clone());
    const dimension = new THREE.Vector3();
    box3.getSize(dimension);
    this.nameTag.position
      .copy(this.position)
      .add(offset)
      .add({ x: 0, y: dimension.y, z: 0 });

    this.nameTag.scale.setScalar(1.5);

    this.scene.add(this.nameTag);
  }

  dispose() {
    this.scene.remove(this.character);
  }

  _updateState(state) {
    if (state == this.state) return;
    this.state = state;
    this._updateAnimationState();
  }

  _initMixer() {
    this.mixer = new THREE.AnimationMixer(this.character);
  }

  _initAnimation() {
    this.animations = this.animationProvider.getAnimations(
      this.mixer,
      this.type
    );
  }
  _updateAnimationState() {
    const animations = [];
    for (const name in this.animations) {
      if (name.split("_")[2] != this.state) continue;
      animations.push(this.animations[name]);
    }

    animations.forEach((a) => {
      a.reset();
      a.play();
    });
  }
  setConversation(c = []) {
    this.conversation = c;

    this.button = new Button({ position: this.position, label: this.name });
    this.button.on("select", () => {
      this.chatId = this.chat.initConversation(this.conversation, this.name);
    });
  }
}

export default Human;
