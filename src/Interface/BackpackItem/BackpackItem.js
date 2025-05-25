class BackpackItem {
  constructor({ name, img, description, count = 0, id }) {
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
    this.count -= count;
    this.$count.innerHTML = this.count;
  }

  delete() {
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
      console.log(this.id);
    });
  }
}

export default BackpackItem;
