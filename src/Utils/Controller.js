import EventEmitter from "./EventEmitter";

let instance = null;

export default class Controller extends EventEmitter {
  constructor() {
    super();

    this.actions = {
      // movement
      forward: false,
      left: false,
      right: false,
      backward: false,
      jump: false,

      // others
      interact: false,
      backpack: false,
      fullscreen: false,
      quest: false,
    };
    this.idle = true;

    document.addEventListener("keydown", (e) => {
      const pressed = e.code;
      switch (pressed) {
        case "KeyW":
        case "ArrowUp":
          this.actions.forward = true;
          break;

        case "KeyA":
        case "ArrowLeft":
          this.actions.left = true;
          break;

        case "KeyD":
        case "ArrowRight":
          this.actions.right = true;
          break;

        case "KeyS":
        case "ArrowDown":
          this.actions.backward = true;
          break;

        case "Space":
          this.actions.jump = true;
          break;

        case "KeyE":
          this.actions.interact = true;
          break;

        case "KeyB":
          this.actions.backpack = true;
          break;

        case "KeyF":
          this.actions.fullscreen = true;
          break;

        case "KeyJ":
          this.actions.quest = true;
          break;
      }
      this.triggerAction();
    });

    document.addEventListener("keyup", (e) => {
      const released = e.code;
      switch (released) {
        case "KeyW":
        case "ArrowUp":
          this.actions.forward = false;
          break;

        case "KeyA":
        case "ArrowLeft":
          this.actions.left = false;
          break;

        case "KeyD":
        case "ArrowRight":
          this.actions.right = false;
          break;

        case "KeyS":
        case "ArrowDown":
          this.actions.backward = false;
          break;

        case "Space":
          this.actions.jump = false;
          break;

        case "KeyE":
          this.actions.interact = false;
          break;

        case "KeyB":
          this.actions.backpack = false;
          break;

        case "KeyF":
          this.actions.fullscreen = false;
          break;

        case "KeyJ":
          this.actions.quest = false;
          break;
      }
      this.triggerAction();
      this.checkIdle();
    });

    // document.addEventListener("click", (e) => {
    //   this.trigger("attack");
    // });
  }

  triggerAction() {
    for (const action in this.actions) {
      if (!this.actions[action]) continue;
      this.idle = false;

      this.trigger(action);
    }
  }

  checkIdle() {
    let active = false;
    for (const action in this.actions) {
      if (this.actions[action]) active = true;
    }
    if (!active) {
      this.idle = true;
      this.trigger("idle");
    }
  }
}
