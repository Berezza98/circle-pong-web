import WatchDisplay from "./WatchDisplay.js";

export default class Background {
  constructor(ctx) {
    this.ctx = ctx;
    this.isLoaded = false;

    this.load();
  }
  
  load() {
    this.image = new Image();

    this.image.addEventListener('load', () => {
      this.isLoaded = true;
    });

    this.image.src = 'images/1.png';
  }

  update() {
    if (!this.isLoaded) return;

    this.draw();
  }

  draw() {
    this.ctx.drawImage(this.image, 0, 0, WatchDisplay.width, WatchDisplay.width);
  }
}