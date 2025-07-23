import EventEmitter from "../../Utils/EventEmitter";
import NPCManager from "../../World/NPCManager";
import PlayerEvent from "../../World/PlayerEvent";
import Backpack from "../Backpack/Backpack";

/* 
  value property data type
    - GIVE :
    {
     name: string
    count: number
    }[]
 
   - REACH : 
   {
   value: vec3
   }

    - TALK : 
    {
    name: string
    }

    - COLLECT : 
    {
    name: string
    count: number
    }
 
*/

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
    // collection based quest 1 = finish
    this.progress = 0;

    // distance based quest
    this.distanceTreshold = 5;
    this.npcManager = new NPCManager();

    this.initUI();
  }

  _validate(evt) {
    if (evt.type != this.type) return false;
    switch (this.type) {
      case PlayerEvent.EVENT_COLLECT || PlayerEvent.EVENT_TALK:
        return this.value.name == evt.value.name;

      // no checking for reach & give, just check the value
      default:
        return true;
    }
  }

  _updateProgress(evt) {
    switch (this.type) {
      case PlayerEvent.EVENT_COLLECT:
        this.progress += evt.value.count / this.value.count;
        this.count += evt.value.count;
        break;
      case PlayerEvent.EVENT_REACH:
        if (this.value.distance(evt.value) <= this.distanceTreshold) {
          this.count = 1;
          this.progress = 1;
        }
        break;
      case PlayerEvent.EVENT_TALK:
        if (evt.value.name == this.value.name) {
          this.count = 1;
          this.progress = 1;
        }
        break;
      // incorrect, uppdate in future
      case PlayerEvent.EVENT_GIVE:
        this.value.forEach((ask) => {
          evt.value.forEach((get) => {
            if (ask.name != get.name) {
              console.error(`not matched name ${ask.name} : ${get.name}`);
              return;
            }
            if (ask.count > get.count) {
              console.error(`not matched count ${ask.count} : ${get.count}`);
              return;
            }
            this.count++;
            this.progress += 1 / this.value.length;
            if (this.count == this.value.length) this.progress = 1;
          });
        });
        break;
      default:
        break;
    }
  }

  update(evt) {
    if (!this._validate(evt)) return;

    this._updateProgress(evt);
    if (this.progress >= 1) {
      this.complete();
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
    switch (this.type) {
      case PlayerEvent.EVENT_COLLECT:
        return `<span>[${this.count} / ${this.value.count}]</span> <span>collect ${this.value.name}</span>`;

      case PlayerEvent.EVENT_REACH:
        return `<span>[${this.count} / 1]</span> <span>visit ${this.value.name}</span>`;

      case PlayerEvent.EVENT_TALK:
        return `<span>[${this.count} / 1]</span> <span>talk to ${this.value.name}</span>`;

      case PlayerEvent.EVENT_GIVE:
        return `<span>[${this.count} / ${this.value.length}]</span> <span>give ${this.value[0].name} to ${this.value[0].receiver}</span>`;

      default:
        break;
    }
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
