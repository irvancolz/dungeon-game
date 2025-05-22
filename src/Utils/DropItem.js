import Button from "../Interface/Button/Button";
import Backpack from "./Backpack";
import BackpackItem from "./BackpackItem";

class DropItem {
  constructor({ id, name, count, position }) {
    this.id = id;
    this.name = name;
    this.count = count;
    this.position = position;
    this.backpack = new Backpack();

    this.initButton();
  }

  initButton() {
    this.button = new Button({ label: this.name, position: this.position });
    this.button.on("select", () => {
      this.take();
    });
  }

  take() {
    const item = new BackpackItem({ id: this.id });
    this.backpack.insert(item, this.count);
    this.dispose();
  }

  update(playerPos) {
    this.button.update(playerPos);
  }

  dispose() {
    this.button.dispose();
  }
}

export default DropItem;
