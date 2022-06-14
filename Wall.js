export default class Wall {
  constructor(game, start, end) {
    this.ctx = game.ctx;
    this.start = start;
    this.end = end;
  }

  update() {


    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
    this.ctx.restore();
  }
}