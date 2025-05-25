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
    };
    this.idle = true;

    document.addEventListener("keydown", (e) => {
      const pressed = e.code;
      if (pressed == "KeyW" || pressed == "ArrowUp") {
        this.actions.forward = true;
      } else if (pressed == "KeyA" || pressed == "ArrowLeft") {
        this.actions.left = true;
      } else if (pressed == "KeyD" || pressed == "ArrowRight") {
        this.actions.right = true;
      } else if (pressed == "KeyS" || pressed == "ArrowDown") {
        this.actions.backward = true;
      } else if (pressed == "Space") {
        this.actions.jump = true;
      } else if (pressed == "KeyE") {
        this.actions.interact = true;
      } else if (pressed == "KeyB") {
        this.actions.backpack = true;
      }
      this.triggerAction();
    });

    document.addEventListener("keyup", (e) => {
      const pressed = e.code;
      if (pressed == "KeyW" || pressed == "ArrowUp") {
        this.actions.forward = false;
      } else if (pressed == "KeyA" || pressed == "ArrowLeft") {
        this.actions.left = false;
      } else if (pressed == "KeyD" || pressed == "ArrowRight") {
        this.actions.right = false;
      } else if (pressed == "KeyS" || pressed == "ArrowDown") {
        this.actions.backward = false;
      } else if (pressed == "Space") {
        this.actions.jump = false;
      } else if (pressed == "KeyE") {
        this.actions.interact = false;
      } else if (pressed == "KeyB") {
        this.actions.backpack = false;
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
