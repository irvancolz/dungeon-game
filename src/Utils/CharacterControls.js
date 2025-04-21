import EventEmitter from "./EventEmitter";

export default class CharacterControls extends EventEmitter {
  constructor() {
    super();
    this.actions = {
      forward: false,
      left: false,
      right: false,
      backward: false,
      jump: false,
    };

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
      }
      this.triggerAction();
    });

    document.addEventListener("click", (e) => {
      this.trigger("attack");
    });
  }

  triggerAction() {
    for (const action in this.actions) {
      if (!this.actions[action]) continue;
      this.trigger(action);
    }
  }
}
