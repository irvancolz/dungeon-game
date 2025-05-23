import Button from "../Interface/Button/Button";
import Backpack from "./Backpack";
import BackpackItem from "./BackpackItem";
import EventEmitter from "./EventEmitter";

class DropItem extends EventEmitter {
  constructor({ id, name, count, position }) {
    super();
    this.id = id;
    this.name = name;
    this.count = count;
    this.position = position;
    this.backpack = new Backpack();
    this.taken = false;

    this.initButton();
  }

  initButton() {
    this.button = new Button({ label: this.name, position: this.position });
    this.button.on("select", () => {
      if (this.taken) return;
      this.take();
      this.trigger("taken");
    });
  }

  take() {
    const item = new BackpackItem({ id: this.id });
    this.backpack.insert(item, this.count);
    this.taken = true;
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
