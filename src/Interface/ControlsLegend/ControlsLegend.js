class ControlsLegend {
  #KEYS = [
    {
      label: "move",
      key: ["a / left", "s / down", "d / right", "w / up"],
    },
    {
      label: "jump",
      key: ["space"],
    },
    {
      label: "zoom",
      key: ["scroll"],
    },
    {
      label: "backpack",
      key: ["b"],
    },
    {
      label: "quest",
      key: ["j"],
    },
    {
      label: "info",
      key: ["i"],
    },
  ];

  constructor() {
    this._init();
  }
  _init() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("id", "controls_legend");

    let content = "";
    for (let i = 0; i < this.#KEYS.length; i++) {
      content += this._generate(this.#KEYS[i].key, this.#KEYS[i].label);
    }
    this.$ui.innerHTML = content;

    document.body.appendChild(this.$ui);
  }

  _generate(key, label) {
    let keys = "";
    key.forEach((k) => {
      keys += `<span class="key">${k}</span>`;
    });
    return `
      <div class='legend'>
      <div class="keys_container">
        ${keys}
      </div>
      <span class="label">${label}</span>
      </div>
    `;
  }
}

export default ControlsLegend;
