import * as THREE from "three";
let instance = null;
class NPCManager {
  constructor() {
    if (instance != null) return instance;

    instance = this;

    this.members = [];
  }

  addNPC(npc) {
    this.members.push(npc);
  }

  update(delta) {
    this.members.forEach((el) => {
      el.update(delta);
    });
  }

  removeNPC(npc) {
    const idx = this.members.indexOf(npc);
    if (idx < 0) return;
    this.members.splice(idx, 1);
    npc.dispose();
  }

  dispose() {
    this.members.forEach((el) => {
      el.dispose();
    });
  }
}

export default NPCManager;
