import EventManager from "../../World/EventManager";
import Backpack from "../Backpack/Backpack";

class ItemReceiver {
  static instance;
  static getInstance() {
    return ItemReceiver.instance;
  }
  constructor() {
    if (ItemReceiver.instance) return ItemReceiver.instance;

    ItemReceiver.instance = this;

    this.items = [];
    this.initUI();
    this.source = new Backpack();
    this.eventManager = EventManager.getInstance();
  }

  initUI() {
    this.$ui = document.createElement("ul");
    this.$ui.className = "item_receiver";

    this.$list = document.createElement("ul");
    this.$list.className = "list";
    this.$list.innerHTML = `<p class="empty">select any item </p>`;
    this.$ui.appendChild(this.$list);

    this.$actions = document.createElement("div");
    this.$actions.className = "actions";
    this.$actions.innerHTML = `
     <button class="btn confirm_btn">confirm</button>
     <button class="btn cancel_btn">cancel</button>
    `;

    const confirmBtn = this.$actions.querySelector(".confirm_btn");
    confirmBtn.addEventListener("click", () => {
      this.items.forEach((i) => {
        this.source.takeout(i, i.count);
      });
      this.reset();
    });
    const cancelBtn = this.$actions.querySelector(".cancel_btn");
    cancelBtn.addEventListener("click", () => {
      this.reset();
    });
  }

  updateSelected(item) {
    if (!item) {
      this.reset();
      return;
    }
    if (this.items.length == 0) {
      this.$list.innerHTML = null;
      this.$ui.appendChild(this.$actions);
    }
    this.items.push(item);
    item.select();
    this.$list.appendChild(item.$ui.cloneNode(true));
  }

  reset() {
    if (this.items.length <= 0) return;
    this.items.forEach((i) => i.deselect());
    this.items = [];
    this.$list.innerHTML = `<p class="empty">select any item </p>`;
    this.$ui.removeChild(this.$actions);
  }
  find(name) {
    return this.items.find((el) => el.name == name);
  }
}

export default ItemReceiver;
