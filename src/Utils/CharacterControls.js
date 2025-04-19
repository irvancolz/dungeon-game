import EventEmitter from "./EventEmitter";

export default class CharacterControls extends EventEmitter {
  constructor() {
    super();

    document.addEventListener("keydown", (e) => {
      const pressed = e.code;
      if (pressed == "KeyW" || pressed == "ArrowUp") {
        this.trigger("forward");
      } else if (pressed == "KeyA" || pressed == "ArrowLeft") {
        this.trigger("left");
      } else if (pressed == "KeyD" || pressed == "ArrowRight") {
        this.trigger("right");
      } else if (pressed == "KeyS" || pressed == "ArrowDown") {
        this.trigger("backward");
      } else if (pressed == "Space") {
        this.trigger("jump");
      }
    });

    document.addEventListener("click", (e) => {
      this.trigger("attack");
    });
  }
}
