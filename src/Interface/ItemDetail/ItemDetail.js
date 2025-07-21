import States from "../../States";
import DropItemManager from "../DropItemManager";
let instance = null;

class ItemDetail {
  constructor() {
    if (instance != null) {
      return instance;
    }

    this.states = new States();
    instance = this;
    this.item = null;
    this.dropMgr = new DropItemManager();

    this.initUI();
  }

  initUI() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("class", "item_detail");
    this.updateUI();
  }

  updateUI() {
    if (!this.item) {
      this.$ui.innerHTML = `<p class="empty">select any item to see detail </p>`;
      return;
    }

    this.$ui.innerHTML = `
    <div class="card">
    <div class="header">
      <img src="${this.item.img}" alt="${this.item.name}" class="img" />
      <div class="item">
        <h2 class="name">${this.item.name}</h2>
        <p class="count">Owned : ${this.item.count}</p>
      </div>
    </div>
        <p class="desc">${this.item.description}</p>
        <ul class="stats">
            <li class="stats_item">stats 1</li>
            <li class="stats_item">stats 2</li>
            <li class="stats_item">stats 3</li>
        </ul>
        <div class="action">
        <button class="btn drop_btn">drop</button>
        </div>
    </div>
    `;
  }

  changeItem(item) {
    if (!item) {
      this.item = null;
      this.updateUI();
      return;
    }

    this.item = item;
    this.updateUI();

    const $dropBtn = this.$ui.querySelector(".drop_btn");
    $dropBtn.addEventListener("click", () => {
      this.drop();
    });
  }

  drop() {
    const drop = {
      id: this.item.id,
      count: this.item.count,
      position: this.states.getPlayerPosition(),
    };

    this.item.delete();
    this.dropMgr.add(drop);
    this.item = null;
    this.updateUI();
  }
}

export default ItemDetail;
