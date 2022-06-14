import Vector from "./Vector.js";

const HEIGHT = 480;
const WIDTH = 480;

export default class WatchDisplay {
  constructor(ctx) {
    this.width = WIDTH;
    this.height = HEIGHT;
    this.center = new Vector(this.width / 2, this.height / 2);
    this.ctx = ctx;
  }

  static center = new Vector(WIDTH / 2, HEIGHT / 2);

  update() {
    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = 'blue';
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.width / 2, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }
}