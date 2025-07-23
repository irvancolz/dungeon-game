import EventManager from "../../World/EventManager";
import PlayerEvent from "../../World/PlayerEvent";
import Backpack from "../Backpack/Backpack";

class ItemReceiver {
  static instance;
  static getInstance() {
    return ItemReceiver.instance;
  }
  constructor() {
    if (ItemReceiver.instance) return ItemReceiver.instance;

    ItemReceiver.instance = this;

    this.requirements = [];
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
     <button class="btn confirm_btn disabled">confirm</button>
     <button class="btn cancel_btn">cancel</button>
    `;

    this.$confirmBtn = this.$actions.querySelector(".confirm_btn");
    this.$confirmBtn.addEventListener("click", () => {
      this._claim();
    });
    const cancelBtn = this.$actions.querySelector(".cancel_btn");
    cancelBtn.addEventListener("click", () => {
      this.reset();
    });
  }

  _claim() {
    this.eventManager.trigger("update", [
      new PlayerEvent(PlayerEvent.EVENT_GIVE, this.requirements),
    ]);
    this.requirements.forEach((i) => {
      this.source.takeout(i, i.count);
    });
    this.reset();
  }

  _validate() {
    if (this.requirements.length <= 0) {
      console.warn(
        "ITEM RECEIVER: no requirements specified event get validated"
      );
      return true;
    }
    let valid = 0;
    this.requirements.forEach((req) => {
      this.items.forEach((i) => {
        if (req.name == i.name && req.count <= i.count) valid++;
      });
    });
    return valid == this.requirements.length;
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

    const valid = this._validate();
    if (valid) {
      this.$confirmBtn.classList.remove("disabled");
    } else {
      this.$confirmBtn.classList.add("disabled");
    }
  }
  setRequirements(items) {
    this.requirements = items;
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
