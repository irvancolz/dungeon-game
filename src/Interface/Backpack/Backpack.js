import { itemsUtils } from "../../Backend/items";
import Controller from "../../Utils/Controller";
import ItemDetail from "../ItemDetail/ItemDetail";
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

    this.items = [];
    this.filter = [];
    this.controller.on("backpack", () => {
      this.toggle();
    });

    this.initInterface();
  }

  init(seed = []) {
    for (let i = 0; i < seed.length; i++) {
      this._addNewItem(seed[i]);
    }
  }

  _addNewItem(item) {
    const newItem = itemsUtils.toBackpackItem(
      item.name,
      item.count,
      item.model
    );
    this.$ui.append(newItem.$ui);
    newItem.on("select", (id) => {
      this.secondaryInterface.updateSelected(newItem);
    });
    newItem.on("delete", () => {
      this.delete(newItem);
    });
    this.items.push(newItem);
  }

  insert(item, count) {
    const target = this.find(item.name);
    item.count = count;
    if (!target) {
      this._addNewItem(item);
    } else {
      target.add(count);
    }
    this.notification.addNotification(`${item.name} x ${count}`);
  }

  find(name) {
    return this.items.find((e) => e.name == name);
  }

  takeout(item, count) {
    const target = this.find(item.name);
    if (!target) return false;
    target.subtract(count);
    if (target.count <= 0) {
      this.delete(target);
    }
    return true;
  }

  delete(item) {
    const target = this.find(item.name);
    if (!target) return;
    const idx = this.items.indexOf(target);
    this.items.splice(idx, 1);
    this.$ui.removeChild(item.$ui);
  }

  initInterface() {
    this.initBackpackInterface();
    this.initSecondaryInterface();
  }

  initSecondaryInterface() {
    this.secondaryInterface = new ItemDetail();
    this.$content.appendChild(this.secondaryInterface.$ui);
  }

  setSecondaryInterface(newInterface) {
    if (!newInterface) {
      console.error(
        "Backpack : failed change secondary interface into :",
        newInterface
      );
      return;
    }

    this.$content.removeChild(this.secondaryInterface.$ui);
    this.$content.appendChild(newInterface.$ui);
    this.secondaryInterface = newInterface;
  }

  initBackpackInterface() {
    // blur bg
    this.$container = document.getElementById("backpack");

    // backpack
    this.$wrapper = document.createElement("div");
    this.$wrapper.className = "backpack_container";
    this.$wrapper.innerHTML = `
      <div class="header">
        <h2>backpack</h2>
      </div>
      <div class='content'></div>
      `;
    this.$container.appendChild(this.$wrapper);

    this.$header = this.$wrapper.querySelector(".header");
    this.$content = this.$wrapper.querySelector(".content");

    this.$closeBtn = document.createElement("button");
    this.$closeBtn.className = "close_btn";
    this.$closeBtn.innerHTML = `      <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M25.7078 5.70798C25.8008 5.61501 25.8745 5.50463 25.9248 5.38315C25.9752 5.26167 26.0011 5.13147 26.0011 4.99998C26.0011 4.86849 25.9752 4.73829 25.9248 4.61681C25.8745 4.49534 25.8008 4.38496 25.7078 4.29198C25.6148 4.19901 25.5044 4.12525 25.383 4.07493C25.2615 4.02462 25.1313 3.99872 24.9998 3.99872C24.8683 3.99872 24.7381 4.02462 24.6166 4.07493C24.4952 4.12525 24.3848 4.19901 24.2918 4.29198L14.9998 13.586L5.7078 4.29198C5.61482 4.19901 5.50444 4.12525 5.38297 4.07493C5.26149 4.02462 5.13129 3.99872 4.9998 3.99872C4.86831 3.99872 4.73811 4.02462 4.61663 4.07493C4.49515 4.12525 4.38477 4.19901 4.2918 4.29198C4.19882 4.38496 4.12507 4.49534 4.07475 4.61681C4.02443 4.73829 3.99854 4.86849 3.99854 4.99998C3.99854 5.13147 4.02443 5.26167 4.07475 5.38315C4.12507 5.50463 4.19882 5.61501 4.2918 5.70798L13.5858 15L4.2918 24.292C4.10402 24.4798 3.99854 24.7344 3.99854 25C3.99854 25.2655 4.10402 25.5202 4.2918 25.708C4.47957 25.8958 4.73425 26.0012 4.9998 26.0012C5.26535 26.0012 5.52003 25.8958 5.7078 25.708L14.9998 16.414L24.2918 25.708C24.4796 25.8958 24.7342 26.0012 24.9998 26.0012C25.2653 26.0012 25.52 25.8958 25.7078 25.708C25.8956 25.5202 26.0011 25.2655 26.0011 25C26.0011 24.7344 25.8956 24.4798 25.7078 24.292L16.4138 15L25.7078 5.70798Z"
              fill="black"
            />
          </svg>`;
    this.$closeBtn.addEventListener("click", () => {
      this.close();
    });
    this.$header.appendChild(this.$closeBtn);

    this.$ui = document.createElement("ul");
    this.$ui.setAttribute("class", "backpack");

    this.$content.appendChild(this.$ui);
  }

  close() {
    if (!this.opened) return;
    this.$container.classList.remove("visible");
    this.$container.setAttribute("aria-visible", this.opened);
    this.opened = false;
    this.secondaryInterface.reset();
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
  setFilter(items = []) {
    this.filter = items;
    this._applyFilter();
  }

  _applyFilter() {
    if (this.filter.length <= 0) {
      this.items.forEach((el) => el.enabled());
      return;
    }
    this.items.forEach((el) => {
      if (!this.filter.find((f) => f.name == el.name)) el.disabled();
    });
  }
}

export default Backpack;
