import { items } from "../Backend/items";
import LootExpLog from "../Interface/LootExpLog/LootExpLog";

let instance = null;
class Backpack {
  constructor() {
    if (instance != null) {
      return instance;
    }

    instance = this;
    this.notification = new LootExpLog();

    this.items = [];
  }

  init(seed = []) {
    for (let i = 0; i < seed.length; i++) {
      const item = items.toBackpackItem(seed[i].id, seed[i].count);

      this.items.push(item);
    }
  }

  insert(item, count) {
    const target = this.find(item);

    if (!target) {
      item.add(count);
      this.items.push(item);
    } else {
      target.add(count);
    }

    this.notification.addNotification(`${item.name} x ${count}`);
  }

  find(item) {
    return this.items.find((e) => e.id == item.id);
  }

  takeout(item, count) {
    const target = this.find(item);
    if (!target) return;
    target.subtract(count);
  }

  delete(item) {
    const target = this.find(item);
    if (!target) return;
    const idx = this.items.indexOf(target);
    this.items.splice(idx, 1);
  }
}

export default Backpack;
