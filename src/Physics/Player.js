import RAPIER from "@dimforge/rapier3d";

export default class PlayerPhysics {
  constructor({ world, position, baseMovement = 1, height }) {
    this.world = world;
    this.position = position;
    this.baseMovement = baseMovement;
    this.height = height;

    this.init();
  }

  init() {
    const radius = 0.2;
    this.colliderDesc = RAPIER.ColliderDesc.capsule(
      this.height * 0.5 - radius,
      radius
    );

    this.bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.position.x, this.position.y, this.position.z)
      .setLinearDamping(0.5)
      .setAngularDamping(1);
    this.body = this.world.createRigidBody(this.bodyDesc);
    this.collider = this.world.createCollider(this.colliderDesc, this.body);
  }

  update() {}

  moveForward() {
    this.body.applyImpulse({ x: 0, y: 0, z: this.baseMovement }, true);
  }
  moveBackward() {
    this.body.applyImpulse({ x: 0, y: 0, z: -this.baseMovement }, true);
  }
  moveLeft() {
    this.body.applyImpulse({ x: this.baseMovement, y: 0, z: 0 }, true);
  }
  moveRight() {
    this.body.applyImpulse({ x: -this.baseMovement, y: 0, z: 0 }, true);
  }
  jump() {
    this.body.applyImpulse({ x: 0, y: this.baseMovement, z: 0 }, true);
  }

  dispose() {}
}
