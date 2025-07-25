import { itemsUtils } from "../Backend/items";
import EventManager from "../World/EventManager";
import PlayerEvent from "../World/PlayerEvent";

let instance = null;
class DropItemManager {
  constructor() {
    if (instance != null) return instance;

    instance = this;
    this.eventManager = new EventManager();

    this.items = [];
  }

  setScene(scene) {
    this.scene = scene;
  }

  setTexture(texture) {
    this.texture = texture;
    if (this.material) {
      this.material.uniforms.uAlphaTexture.value = texture;
    }
  }

  initItems(s) {
    for (let i = 0; i < s.length; i++) {
      const seed = s[i];

      this.add(seed);
    }
  }

  init(seed = []) {
    this.initItems(seed);
  }

  update(player) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].update(player);
    }
  }

  add(i) {
    const item = itemsUtils.toDropsItem(i.name, i.count, i.position);
    this.items.push(item);
    this.scene.add(item.mesh);

    item.on("taken", () => {
      const idx = this.items.indexOf(item);

      this.items.splice(idx, 1);
      this.scene.remove(item.mesh);

      this.eventManager.trigger("update", [
        new PlayerEvent(PlayerEvent.EVENT_COLLECT, {
          id: item.id,
          name: item.name,
          count: item.count,
        }),
      ]);
    });
  }
}

export default DropItemManager;
