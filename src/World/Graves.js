import * as THREE from "three";
import GravesMaterial from "../Materials/Graves";

export default class Graves {
  constructor({ positions, scene, model, debug }) {
    this.positions = positions;
    this.scene = scene;
    this.model = model;
    this.debug = debug;
    this.geometry = this.model.scene.children[0].geometry;
    this.material = GravesMaterial();

    this.init();
    this.addDebug();
  }

  init() {
    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.positions.length
    );
    this.scene.add(this.mesh);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.positions.length; i++) {
      const rotation = (Math.random() - 0.5) * Math.PI;
      dummy.rotation.y = rotation;
      dummy.position.copy(this.positions[i]).multiplyScalar(4);
      dummy.position.y = 0.5;

      dummy.updateMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  addDebug() {
    const debugOpt = {
      color: "#515756",
    };
    if (this.debug.active) {
      const f = this.debug.ui.addFolder({ title: "graves", expanded: false });

      f.addBinding(debugOpt, "color").on("change", () => {
        this.material.color.set(new THREE.Color(debugOpt.color));
      });
    }
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.material.dispose();
    this.mesh.dispose();
  }
}
