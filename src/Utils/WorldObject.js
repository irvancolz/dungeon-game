class WorldObject {
  constructor() {
    this.isWorldObj = true;
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
  setStates(state) {
    this.states = state;
  }

  init() {}
}

export default WorldObject;
