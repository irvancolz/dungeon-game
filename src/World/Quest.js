import Backpack from "../Interface/Backpack/Backpack";
import EventEmitter from "../Utils/EventEmitter";
import QuestObjective from "./QuestObjective";

class Quest extends EventEmitter {
  static STATUS_NOT_STARTED = "not_started";
  static STATUS_IN_PROGRESS = "in_progress";
  static STATUS_FINISHED = "finished";
  static STATUS_FAILED = "failed";
  constructor({ title, description, status, dependencies, rewards }) {
    super();

    this.id = Date.now().toString();
    this.title = title;
    this.description = description;
    this.status = status;
    this.objectives = [];
    this.rewards = rewards;
    this.dependencies = dependencies;
    this.currObjective = null;
    this.objectivesCompleted = 0;

    this.backpack = new Backpack();
  }
  // todo
  canStart() {
    return true;
  }

  updateProgress(evt) {
    if (this.status != Quest.STATUS_IN_PROGRESS) {
      console.error(
        `QUEST ${this.title} : try to update quest not in progress status`
      );
      return;
    }

    this.currObjective.update(evt);
    // this.currObjective.on("complete", () => {
    //   console.log("hello");

    //   this.objectivesCompleted++;
    //   if (this.objectivesCompleted == this.objectives.length) {
    //     this.complete();
    //     return;
    //   }

    //   this.currObjective = this.objectives[this.objectivesCompleted];
    // });
  }

  start() {
    this.objectives.sort((a, b) => b.completed - a.completed);
    if (this.status != Quest.STATUS_NOT_STARTED) {
      const completed = this.objectives.filter((el) => el.completed).length;
      this.currObjective = this.objectives[completed];

      this.objectivesCompleted = completed;
    } else {
      this.currObjective = this.objectives[0];
    }

    this.trigger("start");
  }

  complete() {
    this.status = Quest.STATUS_FINISHED;
    this.claim();
    this.trigger("complete");
  }

  claim() {
    if (!this.rewards) return;
    for (let i = 0; i < this.rewards.length; i++) {
      const reward = this.rewards[i];
      this.backpack.insert(reward.name, reward.count);
    }
  }
  setObjectives(obj = []) {
    obj.forEach((e) => {
      const objective = new QuestObjective(e.type, e.value);
      objective.on("complete", () => {
        this.objectivesCompleted++;
        if (this.objectivesCompleted == this.objectives.length) {
          this.complete();
          return;
        }

        this.currObjective = this.objectives[this.objectivesCompleted];
      });
      this.objectives.push(objective);
    });
  }
}

export default Quest;
