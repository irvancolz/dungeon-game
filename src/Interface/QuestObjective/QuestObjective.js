import EventEmitter from "../../Utils/EventEmitter";
import NPCManager from "../../World/NPCManager";
import PlayerEvent from "../../World/PlayerEvent";
import Backpack from "../Backpack/Backpack";

class QuestObjective extends EventEmitter {
  constructor(type, value, onComplete) {
    super();

    this.id = Date.now().toString();
    this.completed = false;

    this.value = value;
    this.type = type;
    this.backpack = new Backpack();
    this.onComplete = onComplete;

    // for display
    this.count = 0;
    // collection based quest
    this.progress = 0;

    // distance based quest
    this.distanceTreshold = 5;
    this.npcManager = new NPCManager();

    this.initUI();
  }

  update(evt) {
    if (evt.type != this.type || evt.value.name != this.value.name) return;

    switch (evt.type) {
      case PlayerEvent.EVENT_COLLECT:
        this.progress += evt.value.count / this.value.count;
        this.count += evt.value.count;
        if (this.progress >= 1) {
          this.complete();
        }
        break;

      case PlayerEvent.EVENT_REACH:
        this.count += 1;
        if (this.value.distance(evt.value) <= this.distanceTreshold) {
          this.complete();
        }
        break;

      case PlayerEvent.EVENT_TALK:
        this.count += 1;
        if (evt.value.name == this.value.name) {
          this.complete();
        }
        break;

      default:
        break;
    }
    this._updateContent();
  }

  setDistanceTreshold(treshold = 5) {
    this.distanceTreshold = treshold;
  }

  complete() {
    this.completed = true;
    this.$ui.classList.add("complete");
    this.trigger("complete");
    if (this.onComplete) {
      this.onComplete.apply(this);
    }
  }

  initUI() {
    this.$ui = document.createElement("div");
    this.$ui.className = "quest_objective";
    this._updateContent();
  }

  checkBackpack() {
    if (this.type != PlayerEvent.EVENT_COLLECT) return;
    const stored = this.backpack.find(this.value.name);
    if (stored) {
      this.count += stored.count;
      this.progress += stored.count / this.value.count;
    }
    if (this.progress >= 1) {
      this.complete();
    }
  }

  getContent() {
    if (this.type == PlayerEvent.EVENT_COLLECT)
      return `<span>[${this.count} / ${this.value.count}]</span> <span>collect ${this.value.name}</span>`;
    if (this.type == PlayerEvent.EVENT_TALK)
      return `<span>[${this.count} / 1]</span> <span>talk to ${this.value.name}</span>`;
    if (this.type == PlayerEvent.EVENT_REACH)
      return `<span>[${this.count} / 1]</span> <span>visit ${this.value.name}</span>`;
    return "";
  }
  _updateContent() {
    this.$ui.innerHTML = this.getContent();
  }
  apply() {
    if (this.type == PlayerEvent.EVENT_TALK) {
      const target = this.npcManager.find(this.value.name);
      if (target) {
        target.setMarker();
        target.setConversation(this.value.chat);
      }
    }
  }
}

export default QuestObjective;
