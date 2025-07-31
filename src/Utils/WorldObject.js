class WorldObject {
  constructor() {
    this.isWorldObj = true;
    this.mesh = null;
  }
  setScene(scene) {
    this.scene = scene;
  }
  setDebugger(debug) {
    this.debug = debug;
  }
  setPhysics(physics) {
    this.physics = physics;
  }

  init() {}
}

export default WorldObject;
