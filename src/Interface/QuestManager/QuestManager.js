import EventManager from "../../World/EventManager";
import Quest from "../Quest/Quest";

class QuestManager {
  static instance;

  static getInstance() {
    return QuestManager.instance;
  }

  #ON_PROGRESS = "on_progress";
  #COMPLETED = "completed";
  #AVAILABLE = "available";

  constructor(quests = []) {
    if (QuestManager.instance) return QuestManager.instance;
    QuestManager.instance = this;

    this.quests = quests;
    this.activeQuest = [];
    this.currentQuest = null;
    this.completedQuest = [];
    this.eventManager = EventManager.getInstance();

    this.eventManager.on("update", (e) => {
      this.activeQuest.forEach((quest) => {
        quest.updateProgress(e);
      });
    });

    this.initUI();
  }

  init() {
    this.quests.forEach((quest, i) => {
      switch (quest.status) {
        case Quest.STATUS_IN_PROGRESS:
          this.start(quest);
          this.quests.splice(i, 1);
          quest.on("complete", () => this.complete(quest));
          break;
        case Quest.STATUS_FINISHED:
          this.completedQuest.push(quest);
          this.quests.splice(i, 1);
        default:
          break;
      }
    });
    this.initUI();
  }

  start(quest) {
    if (this.currentQuest) {
      const $oldUI = this.currentQuest.$ui;
      // this.$ui.removeChild($oldUI);
    }

    this.currentQuest = quest;
    // this.$ui.appendChild(this.currentQuest.$ui);
    this.activeQuest.push(quest);
    this._updateOnProgressQuestsUI();
    quest.start();
  }

  complete(quest) {
    const idx = this.activeQuest.indexOf(quest);
    this.activeQuest.splice(idx, 1);
    this.completedQuest.push(quest);

    this._updateFinishedQuestsUI();
  }

  add(quest) {
    this.quests.push(quest);
  }

  initUI() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("id", "quest_container");

    this._initQuestSection(
      this.#ON_PROGRESS.replaceAll("_", " "),
      this.activeQuest
    );
    this._initQuestSection(this.#COMPLETED, this.quests);
    this._initQuestSection(this.#AVAILABLE, this.completedQuest);

    document.body.appendChild(this.$ui);
  }

  _initQuestSection(title, quests = []) {
    const code = title.replaceAll(" ", "_");

    const $container = document.createElement("div");
    $container.className = `quest_wrapper ${code}`;

    const $title = document.createElement("h3");
    $title.className = "title";
    $title.innerText = title;

    const $list = document.createElement("ul");
    $list.className = "quest_list";
    this._fillQuestList($list, quests);

    $container.appendChild($title);
    $container.appendChild($list);
    this.$ui.appendChild($container);
  }

  _updateOnProgressQuestsUI() {
    const $container = this.$ui.querySelector(
      `.${this.#ON_PROGRESS} .quest_list`
    );
    this._fillQuestList($container, this.activeQuest);
  }
  _updateFinishedQuestsUI() {
    const $container = this.$ui.querySelector(
      `.${this.#COMPLETED} .quest_list`
    );
    this._fillQuestList($container, this.completedQuest);
  }
  _updateAvailableQuestsUI() {
    const $container = this.$ui.querySelector(
      `.${this.#AVAILABLE} .quest_list`
    );
    this._fillQuestList($container, this.quests);
  }
  _fillQuestList($container, quests) {
    quests.forEach((el) => {
      $container.appendChild(el.$ui);
    });
  }
  _updateQuestsListsUI() {
    this._updateFinishedQuestsUI();
    this._updateAvailableQuestsUI();
    this._updateOnProgressQuestsUI();
  }
}

export default QuestManager;
