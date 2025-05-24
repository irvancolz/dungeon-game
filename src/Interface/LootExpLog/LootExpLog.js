import gsap from "gsap";

let instance = null;

class LootExpLlog {
  constructor() {
    if (instance != null) return instance;

    instance = this;
    this.$container = document.getElementById("loot_notification");
  }

  addNotification(label) {
    const $notif = document.createElement("div");
    $notif.setAttribute("class", "notification");
    $notif.innerHTML = `
            <p class='label'>${label}</p>
        `;
    this.$container.append($notif);

    gsap.to($notif, {
      className: "notification hide",
      delay: 2,
      onComplete: () => {
        this.$container.removeChild($notif);
      },
    });
  }
}

export default LootExpLlog;
