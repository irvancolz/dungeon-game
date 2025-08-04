import NPCInformation from "../Seeds/NPC";
import Human from "./Human";

let instance = null;
class NPCManager {
  constructor() {
    if (instance != null) return instance;

    instance = this;

    this.members = [];
    this.refferences = [];
  }

  setScene(scene) {
    this.scene = scene;
  }

  setResources(src) {
    this.resources = src;
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
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
    } else {
      this.refferences.push(npc);
    }
  }

  removeNPC(npc) {
    const reff = this.refferences.find(
      (el) => el.name.toLowerCase() == npc.name.toLowerCase()
    );
    this.refferences.splice(this.refferences.indexOf(reff, 1));

    const idx = this.members.indexOf(npc);
    if (idx < 0) return;
    this.members.splice(idx, 1);
    npc.dispose();
  }

  dispose() {
    this.members.forEach((el, i) => {
      el.dispose();
      this.members.splice(i, 1);
    });
  }

  init() {
    for (let i = 0; i < this.refferences.length; i++) {
      const name = this.refferences[i].name.split("_");
      name.splice(0, 1);
      const info = NPCInformation.getDetail(name.join("_"));
      const person = new Human({
        model: this.resources[info.model],
        name: info.name,
        job: info.job,
        position: this.refferences[i].position,
        quaternion: this.refferences[i].quaternion,
      });
      this.members.push(person);
    }
  }
}

export default NPCManager;
