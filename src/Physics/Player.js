import RAPIER from "@dimforge/rapier3d";

export default class PlayerPhysics {
  constructor(world, position) {
    this.world = world;
    this.position = position;

    this.init();
  }

  init() {
    this.colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.2);
    this.bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.body = this.world.createRigidBody(this.bodyDesc);
    this.collider = this.world.createCollider(this.colliderDesc, this.body);
  }

  update() {}
}
