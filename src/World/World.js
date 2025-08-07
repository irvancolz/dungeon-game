export default class World {
  constructor() {
    // every object in world
    this.environments = [];
  }

  setFloor(floor) {
    if (this.floor) {
      this.floor.dispose();
    }
    this.floor = floor;
    if (this.physics && this.scene && this.debug) {
      this.floor.setPhysics(this.physics);
      this.floor.setScene(this.scene);
      this.floor.setDebugger(this.debug);
    }
  }
  init() {
    this.floor.init();
    this.environments.forEach((obj) => {
      if (obj.setScene) {
        obj.setScene(this.scene);
      }
      if (obj.setDebugger) {
        obj.setDebugger(this.debug);
      }
      if (obj.setPhysics) {
        obj.setPhysics(this.physics);
      }
      if (obj.setStates) {
        obj.setStates(this.states);
      }
      obj.init();
    });
  }

  add(item) {
    if (!item) return;

    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
    } else {
      this.environments.push(item);
    }
  }

  getPlayerPosition() {
    return this.states.playerPosition.getState();
  }

  getElapsed() {
    return this.states.time.elapsed;
  }
  getDelta() {
    return this.states.time.delta;
  }

  setPhysics(phsc) {
    this.physics = phsc;
    this.floor.setPhysics(this.physics);
  }

  setStates(state) {
    this.states = state;
  }

  setScene(scene) {
    this.scene = scene;
    this.floor.setScene(this.scene);
  }

  setDebugger(debug) {
    this.debug = debug;
    this.floor.setDebugger(this.debug);
  }

  setResources(src) {
    this.resources = src;
  }

  update() {
    this.environments.forEach((obj) => {
      obj.update(this);
    });
  }

  dispose() {
    this.floor.dispose();
    this.environments.forEach((obj) => {
      obj.dispose();
    });
  }
}
