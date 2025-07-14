import EventEmitter from "../../Utils/EventEmitter";
import PlayerEvent from "../../World/PlayerEvent";

class QuestObjective extends EventEmitter {
  constructor(type, value) {
    super();

    this.id = Date.now().toString();
    this.completed = false;

    this.value = value;
    this.type = type;

    // collection based quest
    this.progress = 0;

    // distance based quest
    this.distanceTreshold = 5;

    this.initUI();
  }

  update(evt) {
    if (evt.type != this.type || evt.value.name != this.value.name) return;

    switch (evt.type) {
      case PlayerEvent.EVENT_COLLECT:
        this.progress = this.progress + evt.value.count / this.value.count;
        if (this.progress >= 1) {
          this.complete();
        }
        break;

      case PlayerEvent.EVENT_REACH:
        if (this.value.distance(evt.value) <= this.distanceTreshold) {
          this.complete();
        }
        break;

      case PlayerEvent.EVENT_TALK:
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
  }

  initUI() {
    this.$ui = document.createElement("div");
    this.$ui.className = "quest_objective";
    this._updateContent();
  }

  _getContent() {
    if (this.type == PlayerEvent.EVENT_COLLECT)
      return `<span>collect ${this.value.name}</span> <span>${Math.min(
        this.progress * 100,
        100
      )} %</span>`;
    if (this.type == PlayerEvent.EVENT_TALK)
      return `<span>talk to ${this.value.name}</span>`;
    if (this.type == PlayerEvent.EVENT_REACH)
      return `<span>visit ${this.value.name}</span>`;
    return "";
  }
  _updateContent() {
    this.$ui.innerHTML = this._getContent();
  }
}

export default QuestObjective;
