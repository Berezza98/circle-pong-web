import { COLORS } from "./consts.js";
import { normalizeAngle } from "./helpers.js";
import WatchDisplay from "./WatchDisplay.js";

export default class Walls {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.height = 10;
    this.currentAngle = 0;
    this.gap = Math.PI / 180 * 10;

    this.wallsConfig = [
      {
        start: 0 + this.gap,
        end: Math.PI / 2 - this.gap,
        color: 'green',
        id: COLORS.GREEN
      },
      {
        start: Math.PI / 2 + this.gap,
        end: Math.PI - this.gap,
        color: 'yellow',
        id: COLORS.YELLOW
      },
      {
        start: Math.PI + this.gap,
        end: Math.PI + Math.PI / 2 - this.gap,
        color: 'red',
        id: COLORS.RED
      },
      {
        start: Math.PI + Math.PI / 2 + this.gap,
        end: 2 * Math.PI - this.gap,
        color: 'blue',
        id: COLORS.BLUE
      },
    ];
  }

  checkCollision(angle) {
    for (let i = 0; i < this.wallsConfig.length; i++) {
      const wall = this.wallsConfig[i];

      const correctAngle = normalizeAngle(angle);
      const min = normalizeAngle(wall.start + this.currentAngle);
      const max = normalizeAngle(wall.end + this.currentAngle);

      const comparing = min < max ? correctAngle >= min && correctAngle <= max : correctAngle >= min || correctAngle <= max;
      
      if (comparing) return wall;
    }

    return false;
  }

  update() {
    if (this.game.inputHandler.keyboard.rightActive) {
      this.currentAngle = (this.currentAngle + Math.PI / 180 * 2);
    }

    if (this.game.inputHandler.keyboard.leftActive) {
      this.currentAngle = (this.currentAngle - Math.PI / 180 * 2);
    }

    this.draw();
  }

  draw() {
    this.wallsConfig.forEach(({ start, end, color }) => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = this.height;
      this.ctx.strokeStyle = color;
      this.ctx.arc(WatchDisplay.center.x, WatchDisplay.center.y, (WatchDisplay.width / 2) - this.height / 2, start + this.currentAngle, end + this.currentAngle);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }
}