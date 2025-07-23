import * as THREE from "three";
import EventManager from "./EventManager";
import PlayerEvent from "./PlayerEvent";
let instance = null;
class NPCManager {
  constructor() {
    if (instance != null) return instance;

    instance = this;

    this.members = [];
    this.eventManager = new EventManager();
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
    npc.on("chat:ended", () => {
      this.eventManager.trigger("update", [
        new PlayerEvent(PlayerEvent.EVENT_TALK, {
          name: npc.name,
        }),
      ]);
    });
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
