import EveneEmitter from "./EventEmitter.js";
import { lineCircleCollision } from "./helpers.js";
import Vector from "./Vector.js";
import WatchDisplay from "./WatchDisplay.js";

const HEALTH_COLORS = {
  1: 'rgb(255, 0, 0)',
  2: 'rgb(0, 0, 255)',
  3: 'rgb(0, 255, 0)'
};

const SIZES_MAP = {
  TOP: 'TOP',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
};

const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 15;

export default class Brick extends EveneEmitter {
  constructor(game, x, y) {
    super();

    this.ctx = game.ctx;
    this.game = game;
    this.position = new Vector(x, y);
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.angle = 0;
    this.health = 3;

    this.allWalls = {
      [SIZES_MAP.TOP]: { // TOP
        start: new Vector(this.position.x - this.width / 2, this.position.y - this.height / 2),
        end: new Vector(this.position.x + this.width / 2, this.position.y - this.height / 2)
      },
      [SIZES_MAP.LEFT]: { // LEFT
        start: new Vector(this.position.x - this.width / 2, this.position.y - this.height / 2),
        end: new Vector(this.position.x - this.width / 2, this.position.y + this.height / 2)
      },
      [SIZES_MAP.RIGHT]: { // RIGHT
        start: new Vector(this.position.x + this.width / 2, this.position.y - this.height / 2),
        end: new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2)
      },
      [SIZES_MAP.BOTTOM]: { // BOTTOM
        start: new Vector(this.position.x - this.width / 2, this.position.y + this.height / 2),
        end: new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2)
      },
    }
  }

  get isAlive() {
    return this.health > 0;
  }

  get diagonal() {
    return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }

  penetrationResolution(closestPointToThePlatform) {
    const penetrationVector = this.game.ball.position.sub(closestPointToThePlatform);
    this.game.ball.position = this.game.ball.position.add(penetrationVector.setMag(this.game.ball.radius - penetrationVector.mag()));
  }

  hit() {
    this.health -= 1;

    if (!this.isAlive) {
      this.emit('die');
    }
  }

  checkCollisionWithBall() {
    if (!this.game.ball.isFlying || this.game.ball.position.sub(this.position).mag() >= this.diagonal / 2 + this.game.ball.radius) return;

    const collidedSides = [];

    Object.keys(this.allWalls).forEach((wallName) => {
      const { result, projectionPoint } = lineCircleCollision(this.allWalls[wallName], this.game.ball);

      if (result) {
        collidedSides.push({
          projectionPoint,
          wallName
        });
      }
    });

    if (collidedSides.length === 0) return;

    // console.log(collidedSides[0].projectionPoint.sub(this.game.ball.position).mag());
    const closestSide = collidedSides.slice(1).reduce((min, current) => {
      if (current.projectionPoint.sub(this.game.ball.position).mag() < min.projectionPoint.sub(this.game.ball.position).mag()) {
        return current;
      }

      return min;
    }, collidedSides[0]);

    console.log(collidedSides[0].projectionPoint.sub(this.game.ball.position).mag(), collidedSides[1].projectionPoint.sub(this.game.ball.position).mag())
    console.log('closestSide: ', closestSide);

    this.penetrationResolution(closestSide.projectionPoint);
    this.hit();

    switch (closestSide.wallName) {
      case SIZES_MAP.RIGHT:
      case SIZES_MAP.LEFT:
        this.game.ball.velocity.x = -this.game.ball.velocity.x;
        break;
      case SIZES_MAP.TOP:
      case SIZES_MAP.BOTTOM:
        this.game.ball.velocity.y = -this.game.ball.velocity.y;
        break;
    }
  }

  update() {
    if (!this.isAlive) return;

    this.checkCollisionWithBall();
    
    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = HEALTH_COLORS[this.health];
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle);
    this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.ctx.restore();
  }

  static generateField(game, op) {
    const options = Object.assign({}, {
      center: WatchDisplay.center,
      verticalMargins: 20,
      horizontalMargins: 50,
      count: 1,
      inRow: 4,
    }, op);

    const rowCount = Math.ceil(options.count / options.inRow);

    const width = (BRICK_WIDTH * options.inRow) + (options.horizontalMargins * (options.inRow - 1));
    const height = (BRICK_HEIGHT * rowCount) + (options.verticalMargins * (rowCount - 1));

    const initialPosition = options.center.sub(new Vector(width / 2 - BRICK_WIDTH / 2, height / 2 - BRICK_HEIGHT / 2));

    const bricks = new Array(options.count).fill(null).map((el, index) => {
      const column = index % options.inRow;
      const row = Math.floor(index / options.inRow);

      const positionX = initialPosition.x + (column * (BRICK_WIDTH + options.horizontalMargins));
      const positionY = initialPosition.y + (row * (BRICK_HEIGHT + options.verticalMargins));
      return new Brick(game, positionX, positionY)
    });

    return bricks;
  }
}