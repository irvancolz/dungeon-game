import { items } from "../../Backend/items";
import Controller from "../../Utils/Controller";
import LootExpLog from "../LootExpLog/LootExpLog";

let instance = null;
class Backpack {
  constructor() {
    if (instance != null) {
      return instance;
    }

    instance = this;
    this.opened = false;
    this.notification = new LootExpLog();
    this.controller = new Controller();

    this.$container = document.getElementById("backpack");
    this.$header = this.$container.querySelector(".header");
    this.$content = this.$container.querySelector(".content");
    this.$closeBtn = this.$container.querySelector(".close_btn");

    this.items = [];

    this.controller.on("backpack", () => {
      this.toggle();
    });

    this.$closeBtn.addEventListener("click", () => {
      this.close();
    });

    this.initInterface();
  }

  init(seed = []) {
    for (let i = 0; i < seed.length; i++) {
      const item = items.toBackpackItem(seed[i].id, seed[i].count);
      this.$backpackUI.append(item.$ui);
      this.items.push(item);
    }
  }

  insert(item, count) {
    const target = this.find(item);

    if (!target) {
      item.add(count);
      this.$backpackUI.append(item.$ui);
      this.items.push(item);
    } else {
      target.add(count);
    }

    this.notification.addNotification(`${item.name} x ${count}`);
  }

  find(item) {
    return this.items.find((e) => e.id == item.id);
  }

  takeout(item, count) {
    const target = this.find(item);
    if (!target) return;
    target.subtract(count);
  }

  delete(item) {
    const target = this.find(item);
    if (!target) return;
    const idx = this.items.indexOf(target);
    this.items.splice(idx, 1);
  }

  initInterface() {
    this.addBackpacInterface();
    this.initSecondaryInterface();
  }

  initSecondaryInterface() {
    this.$secondaryInterface = document.createElement("div");
    this.$secondaryInterface.setAttribute("class", "item_detail");

    this.$secondaryInterface.innerHTML = "item detail";
    this.$content.appendChild(this.$secondaryInterface);
  }

  addBackpacInterface() {
    this.$backpackUI = document.createElement("ul");
    this.$backpackUI.setAttribute("class", "backpack");

    this.$content.appendChild(this.$backpackUI);
  }

  close() {
    if (!this.opened) return;
    this.$container.classList.remove("visible");
    this.$container.setAttribute("aria-visible", this.opened);
    this.opened = false;
  }

  open() {
    if (this.opened) return;
    this.$container.classList.add("visible");
    this.$container.setAttribute("aria-visible", this.opened);

    this.opened = true;
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }
}

export default Backpack;
