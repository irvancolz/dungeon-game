class PlayerEvent {
  static EVENT_TALK = "talk_to";
  static EVENT_COLLECT = "collect";
  static EVENT_REACH = "reach";

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export default PlayerEvent;
