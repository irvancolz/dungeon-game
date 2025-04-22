import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
/**
 * Reference : https://github.com/Lunakepio/mario-3D-controller/blob/main/src/PlayerController.jsx#L67
 */
export default class PlayerPhysics {
  constructor({ world, debug, height, position }) {
    this.debug = debug;
    this.world = world;
    this.position = position;
    this.height = height;

    this.init();
  }

  init() {
    const radius = 0.5;
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.position.x, this.position.y, this.position.z)
      .enabledRotations(false, true, false);
    this.body = this.world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.capsule(
      this.height * 0.5 - radius,
      radius
    );

    this.collider = this.world.createCollider(colliderDesc, this.body);
  }
  move(direction) {
    this.body.setLinvel(direction, true);
  }
  jump(power) {
    this.body.applyImpulse({ x: 0, y: power, z: 0 }, true);
  }
  reset() {
    this.body.setTranslation({ x: 0, y: 5, z: 0 }, true);
  }
  update() {}
  dispose() {}
}
