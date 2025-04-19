import PlayerPhysics from "../Physics/Player";
import * as THREE from "three";

export default class Player {
  constructor({ scene, model, physics }) {
    this.scene = scene;
    this.model = model;
    this.physics = physics;
    this.position = new THREE.Vector3(0, 5, 0);

    this.init();
  }

  init() {
    // physics and debug physics
    this._physics = new PlayerPhysics(this.physics.world, this.position);
    this.character = this.model.scene.children[0];
    this.character.position.copy(this.position);

    this.scene.add(this.character);
  }

  update() {
    this._physics.update();

    this.character.position.copy(this._physics.body.translation());
  }
}
