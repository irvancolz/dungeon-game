let instance = null;
class NPCManager {
  constructor() {
    if (instance != null) return instance;

    instance = this;

    this.members = [];
  }

  find(name) {
    const npc = this.members.find(
      (el) => el.name.toLowerCase() == name.toLowerCase()
    );
    if (!npc) {
      console.error(`NPC not found : ${name}`);
      return null;
    }
    return npc;
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
