import EventEmitter from "../Utils/EventEmitter";

class EventManager extends EventEmitter {
  static instance;

  static getInstance() {
    return EventManager.instance;
  }

  constructor() {
    super();
    if (EventManager.instance) return EventManager.instance;

    EventManager.instance = this;
  }
}

export default EventManager;
