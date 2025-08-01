import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
/**
 * Reference : https://github.com/Lunakepio/mario-3D-controller/blob/main/src/PlayerController.jsx#L67
 */
export default class PlayerPhysics {
  constructor({ world, height, position }) {
    this.world = world;
    this.initialPosition = position;
    this.position = position;
    this.height = height;
    this.floating = false;
    this.radius = height * 0.25;

    this.init();
  }

  init() {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.position.x, this.position.y, this.position.z)
      .enabledRotations(false, false, false);
    this.body = this.world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.capsule(
      this.height * 0.5 - this.radius,
      this.radius
    ).setFriction(1);

    this.collider = this.world.createCollider(colliderDesc, this.body);
  }
  move(direction) {
    this.body.setLinvel(direction, true);
  }
  jump(power) {
    // prevent infinite jump
    if (this.floating) return;
    this.body.applyImpulse({ x: 0, y: power, z: 0 }, true);
  }
  reset() {
    this.body.setTranslation(
      { x: this.initialPosition.x, y: 5, z: this.initialPosition.z },
      true
    );
  }

  update() {
    const rayOrigin = this.body.translation();
    const ray = new RAPIER.Ray(rayOrigin, { x: 0, y: -2, z: 0 });
    const toi = 1;
    const hit = this.world.castRayAndGetNormal(
      ray,
      toi,
      false,
      undefined,
      undefined,
      undefined,
      this.body.translation()
    );

    this.floating = hit == null;
  }
  dispose() {}
}
