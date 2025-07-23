import Backpack from "../Backpack/Backpack";
import EventEmitter from "../../Utils/EventEmitter";
import QuestObjective from "../QuestObjective/QuestObjective";

class Quest extends EventEmitter {
  static STATUS_NOT_STARTED = "not_started";
  static STATUS_IN_PROGRESS = "in_progress";
  static STATUS_FINISHED = "finished";
  static STATUS_FAILED = "failed";
  constructor({
    title,
    description,
    status,
    dependencies,
    rewards,
    objectives = [],
    onComplete,
  }) {
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
    this.onComplete = onComplete;
    this.setObjectives(objectives);

    this.backpack = new Backpack();
    this.initUI();
  }
  // todo
  canStart() {
    return true;
  }

  updateProgress(evt) {
    if (this.status != Quest.STATUS_IN_PROGRESS) {
      console.warn(
        `QUEST ${this.title} : try to update progress on quest with status ${this.status}`
      );
      return;
    }
    this.currObjective.update(evt);
    this.trigger("update");
  }

  start() {
    this.objectives.sort((a, b) => b.completed - a.completed);
    if (this.status != Quest.STATUS_NOT_STARTED) {
      const completed = this.objectives.filter((el) => el.completed).length;
      this._setCurrentObjective(this.objectives[completed]);

      this.objectivesCompleted = completed;
    } else {
      this._setCurrentObjective(this.objectives[0]);
    }
    this.trigger("start");
  }

  complete() {
    this.status = Quest.STATUS_FINISHED;
    this.$objectiveContainer.innerHTML = null;
    this.claim();
    this.trigger("complete");
    if (this.onComplete) {
      this.onComplete.apply(this);
    }
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
      const objective = new QuestObjective({
        type: e.type,
        value: e.value,
        onComplete: e.onComplete,
        onStart: e.onStart,
      });
      objective.on("complete", () => {
        this.objectivesCompleted++;
        if (this.objectivesCompleted == this.objectives.length) {
          this.complete();
          return;
        }

        this._setCurrentObjective(this.objectives[this.objectivesCompleted]);
      });
      this.objectives.push(objective);
    });
  }

  initUI() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("class", "quest");

    this.$title = document.createElement("p");
    this.$title.className = "title";
    this.$title.innerText = this.title;

    this.$objectiveContainer = document.createElement("div");
    this.$objectiveContainer.className = "objective_container";

    this.$ui.appendChild(this.$title);
    this.$ui.appendChild(this.$objectiveContainer);
  }

  _setCurrentObjective(newObj) {
    // swap UI
    if (this.currObjective) {
      const $oldUI = this.currObjective.$ui;
      this.$objectiveContainer.removeChild($oldUI);
    }

    this.currObjective = newObj;
    if (this.currObjective) {
      this.$objectiveContainer.appendChild(this.currObjective.$ui);
    }

    if (this.status == Quest.STATUS_IN_PROGRESS && this.currObjective) {
      this.currObjective.start();
      this.currObjective.apply();
    }
  }
  getCurrentObjUI() {
    if (this.currObjective) return this.currObjective.getContent();
    return null;
  }
}

export default Quest;
