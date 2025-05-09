let instance = null;
export default class ChatBuble {
  constructor() {
    if (instance != null) {
      return this;
    }
    instance = this;

    this.visible = false;
    this.conversation = [];
    this.activeChat = 0;

    this.init();
  }

  init() {
    this.$container = document.createElement("div");
    this.$container.setAttribute("id", "chat_bubble");
    this.$container.innerHTML = `
      <div class="chat_container">
        <p class="author"></p>
        <p class="chat"></p>
      </div>
      <div class="btn_container">
        <button class="btn close_btn">close</button>
        <button class="btn next_btn visible">next</button>
      </div>`;

    this.$author = this.$container.querySelector(".author");
    this.$chat = this.$container.querySelector(".chat");

    this.$closeBtn = this.$container.querySelector(".close_btn");
    this.$closeBtn.addEventListener("click", () => this.close());

    this.$nextBtn = this.$container.querySelector(".next_btn");
    this.$nextBtn.addEventListener("click", () => this.next());

    document.body.append(this.$container);
  }

  close() {
    // reset to default
    this.visible = false;
    this.$container.classList.remove("visible");
    this.$closeBtn.classList.remove("visible");
    this.$nextBtn.classList.add("visible");
    this.$container.setAttribute("aria-hidden", !this.visible);

    // reset conversation to begining
    this.activeChat = 0;
  }

  next() {
    this.activeChat++;

    if (this.activeChat == this.conversation.length - 1) {
      this.$nextBtn.classList.remove("visible");
      this.$closeBtn.classList.add("visible");

      return;
    }
    this.updateChat();
  }

  open() {
    this.visible = true;
    this.$container.classList.add("visible");
    this.updateChat();
  }

  initConversation(chat = []) {
    this.conversation = chat;
    this.open();
  }

  updateChat() {
    this.$container.setAttribute("aria-hidden", !this.visible);
    this.$author.innerHTML = this.conversation[this.activeChat].author;
    this.$chat.innerHTML = this.conversation[this.activeChat].chat;
  }
}
