import Brick from "../Brick.js";
import Vector from "../Vector.js";
import WatchDisplay from "../WatchDisplay.js";

export default (game) => {
  const rect = Brick.generateField(game, {
    center: WatchDisplay.center,
    verticalMargins: 15,
    horizontalMargins: 15,
    count: 9,
    inRow: 3,
    dynamic: {
      enabled: true,
      frameChangeAngle: (Math.PI / 180) * 1
    }
  });

  const allBricks = [
    ...rect,
  ];

  return allBricks;
}