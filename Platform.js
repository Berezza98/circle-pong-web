import EveneEmitter from "./EventEmitter.js";
import { getCoorditatesAfterRotation } from "./helpers.js";
import Vector from "./Vector.js";
import WatchDisplay from "./WatchDisplay.js";

const COLORS = {
  1: 'red',
  2: 'yellow',
  3: 'green'
}
export default class Platform extends EveneEmitter {
  constructor(game) {
    super();

    this.width = 70;
    this.height = 12;
    this.ctx = game.ctx;
    this.device = game.device;
    this.inputHandler = game.inputHandler;
    this.angle = Math.PI / 2;
    this.lives = 3;
  }

  get fillStyle() {
    return COLORS[this.lives];
  }

  get isOnTopPart() {
    const shortAngle = (this.angle % (2 * Math.PI));
    return ((shortAngle > Math.PI) && (shortAngle < 2 * Math.PI)) || ((shortAngle < 0) && (shortAngle > - Math.PI));
  }

  get position() {
    return Vector.fromAngle(this.angle).mult(this.device.width / 2 - this.height).add(this.device.center);
  }

  get isDied() {
    return this.lives <= 0;
  }

  get coorditates() {
    const originalTopLeft = new Vector(this.position.x - this.width / 2, this.position.y - this.height / 2);
    const originalTopRight = new Vector(this.position.x + this.width / 2, this.position.y - this.height / 2);

    const start = getCoorditatesAfterRotation({
      position: originalTopLeft,
      origin: this.position,
      angle: this.angle - Math.PI / 2,
    });
    const end = getCoorditatesAfterRotation({
      position: originalTopRight,
      origin: this.position,
      angle: this.angle - Math.PI / 2,
    });

    return { start, end };
  }

  get visibleAngle() {
    return this.angle + Math.PI / 2;
  }

  die() {
    this.lives -= 1;

    if (this.isDied) return this.emit(DIED_EVENT);
  }

  update() {
    if (this.inputHandler.keyboard.leftActive) {
      this.angle += Math.PI / 180 * 3;
    }

    if (this.inputHandler.keyboard.rightActive) {
      this.angle -= Math.PI / 180 * 3;
    }

    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.visibleAngle);
    this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.ctx.restore();
  }
}