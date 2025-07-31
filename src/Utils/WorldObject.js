class WorldObject {
  constructor() {
    this.isWorldObj = true;
    this.mesh = null;
  }
  setScene(scene) {
    this.scene = scene;
  }
  init() {
    this.scene.add(this.mesh);
  }
}

export default WorldObject;
