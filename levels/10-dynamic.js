import Brick from "../Brick.js";
import Vector from "../Vector.js";
import WatchDisplay from "../WatchDisplay.js";

export default (game) => {
  const rectTop = Brick.generateField(game, {
    center: WatchDisplay.center,
    verticalMargins: 15,
    horizontalMargins: 15,
    count: 1,
    inRow: 1,
    dynamic: {
      enabled: true,
      frameChangeValue: (Math.PI / 180) * 1,
      rotate: false,
      translate: true,
      min: new Vector(100, 200),
      max: new Vector(WatchDisplay.width- 100, 200),
    }
  });


  const rectBot = Brick.generateField(game, {
    center: WatchDisplay.center,
    verticalMargins: 15,
    horizontalMargins: 15,
    count: 1,
    inRow: 1,
    dynamic: {
      enabled: true,
      frameChangeValue: (Math.PI / 180) * 1,
      rotate: false,
      translate: true,
      min: new Vector(100, WatchDisplay.width - 200),
      max: new Vector(WatchDisplay.width- 100, WatchDisplay.width - 200),
    }
  });

  const line1 = Brick.generateField(game, {
    center: WatchDisplay.center,
    verticalMargins: 0,
    horizontalMargins: 15,
    count: 4,
    inRow: 4,
  });

  const allBricks = [
    ...rectTop,
    ...rectBot,
    ...line1
  ];

  return allBricks;
}