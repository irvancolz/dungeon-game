import EventEmitter from "../../Utils/EventEmitter";

class Conversation extends EventEmitter {
  constructor(chat = []) {
    super();

    this.chat = chat;
    this.progress = 0;
    this.last = this.progress == this.chat.length - 1;
  }

  next() {
    this.progress++;
    this.last = this.progress == this.chat.length - 1;
    this.trigger("chat:update");
    if (this.last) {
      this._finish();
    }
  }
  start() {
    this.trigger("chat:start");
  }
  _finish() {
    this.trigger("chat:end");
  }
  reset() {
    this.last = false;
    this.progress = 0;
  }
  current() {
    return this.chat[this.progress];
  }
}

export default Conversation;
