import { items } from "../../Backend/items";

let instance = null;

class ItemDetail {
  constructor() {
    if (instance != null) {
      return instance;
    }

    instance = this;
    this.item = null;

    this.initUI();
  }

  initUI() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("class", "item_detail");
    this.updateUI();
  }

  updateUI() {
    if (!this.item) {
      this.$ui.innerHTML = "select any item to see detail";

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
        <button class="btn delete_btn">delete</button>
        <button class="btn sell_btn">sell</button>
        </div>
    </div>
    `;
  }

  changeItem(id) {
    if (!id) {
      this.item = null;
      this.updateUI();
      return;
    }

    const newItem = items.get(id);
    this.item = newItem;
    this.updateUI();
  }
}

export default ItemDetail;
