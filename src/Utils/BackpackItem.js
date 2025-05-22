class BackpackItem {
  constructor({ name, img, description, count = 0, id }) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.description = description;
    this.count = count;
  }

  add(count) {
    this.count += count;
  }

  subtract(count) {
    this.count -= count;
  }

  delete() {
    this.count = 0;
  }
}

export default BackpackItem;
