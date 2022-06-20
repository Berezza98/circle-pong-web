import Brick from "../Brick.js";
import Vector from "../Vector.js";
import WatchDisplay from "../WatchDisplay.js";

export default (game) => {
  const leftSide = Brick.generateField(game, {
    center: WatchDisplay.center.sub(new Vector(100, 0)),
    verticalMargins: 15,
    horizontalMargins: 0,
    count: 6,
    inRow: 1,
  });

  const rightSide = Brick.generateField(game, {
    center: WatchDisplay.center.add(new Vector(100, 0)),
    verticalMargins: 15,
    horizontalMargins: 0,
    count: 6,
    inRow: 1,
  });

  const topSide = Brick.generateField(game, {
    center: WatchDisplay.center.sub(new Vector(0, 68)),
    verticalMargins: 0,
    horizontalMargins: 15,
    count: 3,
    inRow: 3,
  });

  const bottomSide = Brick.generateField(game, {
    center: WatchDisplay.center.add(new Vector(0, 68)),
    verticalMargins: 0,
    horizontalMargins: 15,
    count: 3,
    inRow: 3,
  });

  const allBricks = [
    ...leftSide,
    ...rightSide,
    ...topSide,
    ...bottomSide
  ];

  return allBricks;
}