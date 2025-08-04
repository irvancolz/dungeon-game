import Controller from "../../Utils/Controller";
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

    this.open = false;
    this.quests = quests;
    this.activeQuest = [];
    this.currentQuest = null;
    this.completedQuest = [];
    this.eventManager = EventManager.getInstance();
    this.controller = new Controller();

    this.eventManager.on("update", (e) => {
      this.activeQuest.forEach((quest) => {
        quest.updateProgress(e);
      });
    });

    this.controller.on("quest", () => {
      this._toggle();
    });
  }

  init() {
    this._sort();
    this.initUI();
    this.activeQuest.forEach((q) => {
      this.start(q);
    });
  }
  _sort() {
    this.quests.forEach((quest, i) => {
      quest.on("complete", () => {
        this._updateQuestsListsUI();
        this.complete(quest);
      });
      quest.on("update", () => {
        this._updateQuestsListsUI();
        this._updatePinnedMissionUI();
      });
      switch (quest.status) {
        case Quest.STATUS_IN_PROGRESS:
          this.activeQuest.push(quest);
          this.quests.splice(i, 1);
          break;
        case Quest.STATUS_FINISHED:
          this.completedQuest.push(quest);
          this.quests.splice(i, 1);
          break;
        default:
          break;
      }
    });
  }
  start(quest) {
    this._setCurrentQuest(quest);
  }

  complete(quest) {
    const idx = this.activeQuest.indexOf(quest);
    this.activeQuest.splice(idx, 1);
    this.completedQuest.push(quest);

    this._setCurrentQuest(this.activeQuest[0] ?? null);
  }

  _setCurrentQuest(quest) {
    this.currentQuest = quest;
    this.currentQuest.start();
    this._updateOnProgressQuestsUI();
    this._updatePinnedMissionUI();
  }

  add(quest) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
    } else {
      this.quests.push(quest);
    }
  }

  initUI() {
    this._initPinnedMissionUI();
    this._initQuestListUI();
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
    this.$questContainer.appendChild($container);
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
    const $emptyContent = `<p class="empty">no adventure available here</p>`;
    if (quests.length < 1) {
      $container.innerHTML = $emptyContent;
      return;
    }
    $container.innerHTML = null;
    quests.forEach((el) => {
      $container.appendChild(el.$ui);
    });
  }
  _updateQuestsListsUI() {
    this._updateFinishedQuestsUI();
    this._updateAvailableQuestsUI();
    this._updateOnProgressQuestsUI();
  }
  _initPinnedMissionUI() {
    this.$pinnedMission = document.createElement("div");
    this.$pinnedMission.setAttribute("id", "pinned_mission");

    this.$pinnedMission.addEventListener("click", () => {
      this._open();
    });
    document.body.appendChild(this.$pinnedMission);
  }

  _updatePinnedMissionUI() {
    if (!this.currentQuest) {
      this.$pinnedMission.innerHTML = null;
      return;
    }
    const content = `
    <p class='title'>${this.currentQuest.title}</p>
    <p class='desc'>${this.currentQuest.description}</p>
    <p class='objective'>
    ${this.currentQuest.getCurrentObjUI()}
    <p>
    `;

    this.$pinnedMission.innerHTML = content;
  }

  _initQuestListUI() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("id", "quest_container");

    //header
    this.$header = document.createElement("div");
    this.$header.className = "header";

    this.$closeBtn = document.createElement("button");
    this.$closeBtn.className = ".close_btn";
    this.$closeBtn.innerText = "x";
    this.$closeBtn.addEventListener("click", () => {
      this._close();
    });
    this.$header.appendChild(this.$closeBtn);
    this.$header.append("quest");
    this.$ui.appendChild(this.$header);

    // quest container
    this.$questContainer = document.createElement("div");
    this.$questContainer.className = "container";
    this._initQuestSection(
      this.#ON_PROGRESS.replaceAll("_", " "),
      this.activeQuest
    );
    this._initQuestSection(this.#COMPLETED, this.quests);
    this._initQuestSection(this.#AVAILABLE, this.completedQuest);

    this.$ui.appendChild(this.$questContainer);
    document.body.appendChild(this.$ui);
  }
  _toggle() {
    this.open = !this.open;
    this.$ui.setAttribute("data-opened", this.open);
  }
  _open() {
    this.$ui.setAttribute("data-opened", true);
  }
  _close() {
    this.$ui.setAttribute("data-opened", false);
  }
}

export default QuestManager;
