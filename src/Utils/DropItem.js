import { items } from "../Backend/items";
import Button from "../Interface/Button/Button";
import Backpack from "../Interface/Backpack/Backpack";
import EventEmitter from "./EventEmitter";
import EventManager from "../World/EventManager";
import PlayerEvent from "../World/PlayerEvent";
import * as THREE from "three";

class DropItem extends EventEmitter {
  constructor({ id, name, count, position }) {
    super();
    this.id = id;
    this.name = name;
    this.count = count;
    this.position = position;
    this.backpack = new Backpack();
    this.taken = false;
    this.eventManager = EventManager.getInstance();

    this.initButton();
    this.init();
  }

  init() {
    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.25),
      new THREE.MeshBasicMaterial()
    );
    this.mesh.position.copy(this.position.setY(0.25));
  }

  initButton() {
    this.button = new Button({ label: this.name, position: this.position });
    this.button.on("select", () => {
      if (this.taken) return;
      this.take();
      this.trigger("taken");
      this.eventManager.trigger("update", [
        new PlayerEvent(PlayerEvent.EVENT_COLLECT, {
          id: this.id,
          name: this.name,
          count: this.count,
        }),
      ]);
    });
  }

  take() {
    const item = items.toBackpackItem(this.id, this.count);
    this.backpack.insert(item, this.count);
    this.taken = true;
    this.dispose();
  }

  update(playerPos) {
    this.button.update(playerPos);
  }

  dispose() {
    this.button.dispose();
  }
}

export default DropItem;
