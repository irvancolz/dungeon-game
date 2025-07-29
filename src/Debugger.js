import { Pane } from "tweakpane";
let instance = null;
export default class Debugger {
  constructor() {
    if (instance != null) {
      return instance;
    }
    instance = this;
    this.active = window.location.hash == "#debug";
    if (this.active) {
      this.ui = new Pane({
        title: "Dungeon Adventure",
        container: document.getElementById("debugger"),
      });
    }
  }
}
