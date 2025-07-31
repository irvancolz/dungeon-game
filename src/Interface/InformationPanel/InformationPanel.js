import Showdown from "showdown";
import markdown from "../../../readme.md?raw";
import Controller from "../../Utils/Controller";
import States from "../../States";

class InformationPanel {
  constructor() {
    this.opened = false;
    this.parser = new Showdown.Converter();
    this.parser.setFlavor("github");
    this.controller = new Controller();
    this.states = States.getInstance();

    this.controller.on("info", () => {
      this._toggle();
    });

    this._init();
  }
  _init() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("id", "information_panel");
    this.$ui.setAttribute("data-visible", this.opened);

    this.$ui.innerHTML = this.parser.makeHtml(markdown);
    document.body.appendChild(this.$ui);
  }

  _toggle() {
    const hasOverlay = this.states.hasOverlay.getState().value;
    if (!this.opened && hasOverlay) return;
    this.opened = !this.opened;
    this.states.hasOverlay.setState({ value: this.opened });
    this.$ui.setAttribute("data-visible", this.opened);
  }

  open() {
    this.opened = true;
    this.$ui.setAttribute("data-visible", this.opened);
  }
  close() {
    this.opened = false;
    this.$ui.setAttribute("data-visible", this.opened);
  }
}

export default InformationPanel;
