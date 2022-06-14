import Vector from "./Vector.js";

export default class WatchDisplay {
  constructor(ctx) {
    this.width = 480;
    this.height = 480;
    this.center = new Vector(this.width / 2, this.height / 2);
    this.ctx = ctx;
  }

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