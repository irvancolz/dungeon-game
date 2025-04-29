import RAPIER from "@dimforge/rapier3d";

export default class Trunk {
  constructor({ model, scene, physics, position }) {
    this.model = model;
    this.scene = scene;
    this.physicsWorld = physics;
    this.position = position;

    this.init();
  }

  init() {
    // physics
    const colliderDesc = RAPIER.ColliderDesc.capsule(1, 0.2).setTranslation(
      this.position.x,
      this.position.y + 1,
      this.position.z
    );
    const collider = this.physicsWorld.world.createCollider(colliderDesc);

    // view
    const rotation = Math.random() * Math.PI * 2;
    this.model.scene.rotation.y = rotation;
    this.model.scene.position.copy(this.position);

    this.scene.add(this.model.scene);
  }
}
