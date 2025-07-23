class PlayerEvent {
  static EVENT_TALK = "talk_to";
  static EVENT_COLLECT = "collect";
  static EVENT_REACH = "reach";
  static EVENT_GIVE = "give";

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export default PlayerEvent;
