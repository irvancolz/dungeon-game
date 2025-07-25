import EventEmitter from "../../Utils/EventEmitter";
class BackpackItem extends EventEmitter {
  constructor({ name, img, description, count = 0, id }) {
    super();
    this.id = id;
    this.name = name;
    this.img = img;
    this.description = description;
    this.count = count;

    this.initUI();
  }

  add(count) {
    this.count += count;
    this.$count.innerHTML = this.count;
  }

  subtract(count) {
    if (count > this.count) {
      console.error(
        `${this.name} : not suficient amount, required: ${count}, available : ${this.count}`
      );

      return false;
    }
    this.count -= count;
    this.$count.innerHTML = this.count;
    return true;
  }

  delete() {
    this.trigger("delete");
    this.count = 0;
  }

  initUI() {
    this.$ui = document.createElement("li");
    this.$ui.className = "backpack_item";
    this.$ui.setAttribute("data-itemId", this.id);
    this.$ui.setAttribute("data-count", this.count);
    this.$ui.setAttribute("data-img", this.img);
    this.$ui.setAttribute("title", this.name);

    this.$ui.innerHTML = `
    <button class='btn'>
    <span class="count">${this.count}</span>
      <img class="img" src="${this.img}" alt="${this.name}" />
    </button>
    `;

    const btn = this.$ui.querySelector(".btn");
    this.$count = this.$ui.querySelector(".count");

    btn.addEventListener("click", () => {
      this.trigger("select", [this.id]);
    });
  }
  select() {
    this.$ui.classList.add("selected");
  }
  deselect() {
    this.$ui.classList.remove("selected");
  }
  disabled() {
    this.$ui.classList.add("disabled");
  }
  enabled() {
    this.$ui.classList.remove("disabled");
  }
}

export default BackpackItem;
