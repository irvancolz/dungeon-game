import EventEmitter from "../../Utils/EventEmitter";
import EventManager from "../../World/EventManager";
import PlayerEvent from "../../World/PlayerEvent";

export default class ChatBuble extends EventEmitter {
  static instance;

  static getInstance() {
    return ChatBuble.instance;
  }

  constructor() {
    super();

    if (ChatBuble.instance) return ChatBuble.instance;
    ChatBuble.instance = this;

    this.visible = false;
    this.conversation = [];
    this.activeChat = 0;
    this.$container = document.getElementById("chat_bubble");
    this.id = 0;
    this.eventManager = EventManager.getInstance();

    this.init();
  }

  init() {
    this.$container.innerHTML = `
      <div class="chat_container">
      <div class="header">
        <h3 class="author"></h3>
         <div class="btn_container">
          <button class="btn close_btn">close</button>
          <button class="btn next_btn visible">next</button>
        </div>
      </div>
        <p class="chat"></p>
      </div>
     `;

    this.$author = this.$container.querySelector(".author");
    this.$chat = this.$container.querySelector(".chat");

    this.$closeBtn = this.$container.querySelector(".close_btn");
    this.$closeBtn.addEventListener("click", () => this.close());

    this.$nextBtn = this.$container.querySelector(".next_btn");
    this.$nextBtn.addEventListener("click", () => this.next());
  }

  close() {
    // reset to default
    this.visible = false;
    this.$container.classList.remove("visible");
    this.$closeBtn.classList.remove("visible");
    this.$nextBtn.classList.add("visible");
    this.$container.setAttribute("aria-visible", this.visible);

    // reset conversation to begining
    this.activeChat = 0;

    this.trigger("chat:ended", [this.id]);
  }

  next() {
    this.activeChat++;
    this.updateActionBtn();
    this.updateChat();
  }

  open() {
    this.updateActionBtn();
    this.visible = true;
    this.$container.classList.add("visible");
    this.updateChat();
  }

  initConversation(chat = []) {
    this.conversation = chat;
    this.id = Date.now();

    this.open();

    return this.id;
  }

  updateChat() {
    this.$container.setAttribute("aria-visible", this.visible);

    this.$author.innerHTML = this.conversation[this.activeChat].author;
    this.$chat.innerHTML = this.conversation[this.activeChat].chat;

    const height = this.$chat.getBoundingClientRect().height;
    if (height > 0) {
      this.$chat.style.setProperty("--chat-height", height + "px");
      this.trigger("chat:update");
    }
  }

  updateActionBtn() {
    if (this.activeChat < this.conversation.length - 1) return;
    this.$nextBtn.classList.remove("visible");
    this.$closeBtn.classList.add("visible");
  }
}
