class NPC {
  #STATE_IDLE = "idle";
  constructor({ position, model, name, scene, quaternion, scale }) {
    this.position = position;
    this.model = model;
    this.name = name;
    this.scene = scene;
    this.state = this.#STATE_IDLE;
    this.quaternion = quaternion;

    this.init();
  }

  init() {
    this.character = this.model.scene.children[0];
    this.character.position.copy(this.position);
    this.character.quaternion.copy(this.quaternion);

    this.scene.add(this.character);
  }

  update(elapsed) {}

  dispose() {}
}

export default NPC;
