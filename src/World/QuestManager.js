import EventManager from "./EventManager";

class QuestManager {
  static instance;

  static getInstance() {
    return QuestManager.instance;
  }

  constructor() {
    if (QuestManager.instance) return QuestManager.instance;
    QuestManager.instance = this;

    this.quests = [];
    this.eventManager = EventManager.getInstance();

    this.eventManager.on("update", (e) => {
      this.quests.forEach((quest) => {
        quest.updateProgress(e);
      });
    });
  }

  init() {
    this.quests.forEach((quest) => {
      quest.start();
    });
  }

  add(quest) {
    this.quests.push(quest);
  }
}

export default QuestManager;
