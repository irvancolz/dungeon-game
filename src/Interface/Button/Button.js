import * as THREE from "three";
import EventEmitter from "../../Utils/EventEmitter";
import Controller from "../../Utils/Controller";

export default class Button extends EventEmitter {
  constructor({ position, label, once = false, radius = 3 }) {
    super();

    this.position = position;
    this.label = label;
    this.visible = false;
    this.$container = document.getElementById("interactive_container");
    this.radius = radius;
    this.expired = false;
    this.controls = new Controller();
    this.once = once;

    this.controls.on("interact", () => {
      if (!this.visible || this.expired) return;
      this.handleSelect();
    });
    this.init();
  }

  init() {
    this.$wrapper = document.createElement("div");
    this.$wrapper.setAttribute("class", "interaction");
    this.$wrapper.innerHTML = `  
        <button class="btn" title="${this.label}">
          <span class="key">e</span>
          <span class="label">${this.label}</span>
        </button>
      `;

    this.$btn = this.$wrapper.querySelector(".btn");

    this.$btn.addEventListener("click", () => {
      if (!this.visible || this.expired) return;
      this.handleSelect();
    });

    this.$container.appendChild(this.$wrapper);
  }

  handleSelect() {
    this.trigger("select");
    if (this.once) {
      this.expired = true;
      this.hide();
    }
  }

  show() {
    if (this.visible) return;
    this.visible = true;
    this.$wrapper.classList.add("visible");
  }

  hide() {
    if (!this.visible) return;
    this.visible = false;
    this.$wrapper.classList.remove("visible");
  }

  update(playerPos) {
    const dist = this.position.distanceTo(new THREE.Vector3().copy(playerPos));
    if (dist <= this.radius && !this.expired) {
      this.show();
    } else {
      this.hide();
    }
  }

  dispose() {
    this.visible = false;
    this.expired = true;
    const target = this.$container.querySelector(".interaction");
    if (!target) return;
    this.$container.removeChild(this.$wrapper);
  }
}
