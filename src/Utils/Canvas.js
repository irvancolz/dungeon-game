class Canvas {
  constructor() {
    this.width = 256;
    this.height = 256;
    this.ratio = Math.ceil(window.devicePixelRatio);
    this.line = 0;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.baseLine = "middle";
    this.textAlign = "center";
    this.color = "white";
    this.fontSize = 24;
    this.fontFamily = "Arial";

    this.texts = [];

    this.init();
  }

  init() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(this.ratio, this.ratio);

    this.ctx.textBaseline = this.baseLine;
    this.ctx.textAlign = this.textAlign;
    this.ctx.fillStyle = this.color;
    this.ctx.globalCompositeOperation = "source-over";
  }

  write(text) {
    this.texts.push({ text: text, size: this.fontSize });

    let min = 0;
    for (let i = 0; i < this.texts.length; i++) {
      if (i / this.texts.length >= 0.5) break;
      min += this.texts[i].size;
    }

    // keep text on center
    for (let i = 0; i < this.texts.length; i++) {
      this.ctx.font = `${this.texts[i].size}px ${this.fontFamily}`;
      this.ctx.fillText(
        this.texts[i].text,
        this.width * 0.5,
        this.height * 0.5 - min
      );

      const spacing = this.texts[i].size * 0.5;
      const offset = min - this.texts[i].size - spacing;
      min = offset;
    }
  }

  debug() {
    this.canvas.style.position = "fixed";
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.zIndex = 1000;
    this.canvas.style.backgroundColor = "black";
    document.body.appendChild(this.canvas);
  }

  setFont(size = 0, family = "", color = "") {
    if (size > 0) this.fontSize = size;
    if (family) this.fontFamily = family;
    if (color) this.color = color;
  }
}

export default Canvas;
