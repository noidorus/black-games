import { Application } from 'pixi.js';
import { UI } from './UI';
import { IResizeParams } from './interfaces';

export class SceneManager {
  #ui: UI;
  resizeTimeoutId: number | null = null;
  resizeTimeout = 300;

  constructor() {
    this.#ui = new UI();
  }

  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  intoResizeParams(): IResizeParams {
    return { viewWidth: this.width, viewHeight: this.height };
  }

  async initialize() {
    const app = new Application();
    await app.init({
      resizeTo: window,
      width: this.width,
      height: this.height,
      background: 'white',
    });

    document.getElementById('pixi-container')!.appendChild(app.canvas);

    app.stage.addChild(this.#ui);
    window.addEventListener('resize', () => this.resizeDeBounce());
  }

  resizeDeBounce() {
    this.cancelScheduledResizeHandler();
    this.scheduleResizeHandler();
  }

  resizeHandler() {
    this.#ui.handleResize(this.intoResizeParams());
  }

  cancelScheduledResizeHandler() {
    if (this.resizeTimeoutId) clearTimeout(this.resizeTimeoutId);
  }

  scheduleResizeHandler() {
    this.resizeTimeoutId = window.setTimeout(() => {
      this.cancelScheduledResizeHandler();
      this.resizeHandler();
    }, this.resizeTimeout);
  }
}
