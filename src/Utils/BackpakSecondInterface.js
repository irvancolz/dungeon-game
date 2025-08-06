import Backpack from "../Interface/Backpack/Backpack";

class BackpackSecondInterface {
  constructor() {
    this.requirements = [];
    this.source = new Backpack();
  }
  setRequirements(items) {
    this.requirements = items;
    this.source.setFilter(this.requirements);
  }

  reset() {}
  updateSelected(item) {}
}

export default BackpackSecondInterface;
