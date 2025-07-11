import EventEmitter from "../Utils/EventEmitter";
import PlayerEvent from "./PlayerEvent";

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
  }

  setDistanceTreshold(treshold = 5) {
    this.distanceTreshold = treshold;
  }

  complete() {
    this.completed = true;
    this.trigger("complete");
  }
}

export default QuestObjective;
