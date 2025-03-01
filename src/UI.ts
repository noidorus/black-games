import { Assets, Container } from 'pixi.js';
import { IResizeParams } from './interfaces';
import { IntroModal } from './IntroModal';
import { FirstModal } from './FirstModal';
import { SecondModal } from './SecondModal';

export class UI extends Container {
  baseWidth = 1440;
  baseHeight = 1024;
  introModal!: IntroModal;
  firstModal!: FirstModal;
  secondModal!: SecondModal;

  constructor() {
    super();
    this.preloadAssets().then(() => {
      this.setup();
    });
  }

  private async preloadAssets() {
    Assets.addBundle('images', [
      { alias: 'startBtn', src: '/assets/textures/start-btn.png' },
      { alias: 'infoPlate', src: '/assets/textures/info-plate.png' },
      { alias: 'star', src: '/assets/textures/star.png' },
      { alias: 'arrowRight', src: '/assets/textures/arrow-right.png' },
      { alias: 'arrowLeft', src: '/assets/textures/arrow-left.png' },
      { alias: 'closeBtn', src: '/assets/textures/close.png' },
      { alias: 'miniStarsLight', src: '/assets/textures/mini-stars-light.png' },
      { alias: 'miniStarsRed', src: '/assets/textures/mini-stars-red.png' },
      { alias: 'textBox', src: '/assets/textures/text-box.png' },
      { alias: 'wheel', src: '/assets/textures/wheel.png' },
      { alias: 'controlsBg', src: '/assets/textures/controls-bg.png' },
      { alias: 'arrowSmall', src: '/assets/textures/arrow-small.png' },
    ]);

    await Assets.loadBundle('images');

    Assets.addBundle('fonts', [
      { alias: 'RuslanDisplay', src: '/assets/fonts/RuslanDisplay.ttf' },
      { alias: 'AlumniSans', src: '/assets/fonts/AlumniSans.ttf' },
      { alias: 'AnekDevanagari', src: '/assets/fonts/AnekDevanagari.ttf' },
    ]);

    await Assets.loadBundle('fonts');
  }

  private setup() {
    const firstModal = new FirstModal({ visible: false });
    this.addChild(firstModal);
    this.firstModal = firstModal;
    this.firstModal.closeBtn.on('pointerdown', this.switchToInto);

    const secondModal = new SecondModal({ visible: false });
    this.addChild(secondModal);
    this.secondModal = secondModal;
    this.secondModal.closeBtn.on('pointerdown', this.switchToInto);

    const introModal = new IntroModal({
      pages: [
        { name: firstModal.name, text: 'я диспетчер' },
        { name: secondModal.name, text: 'а что это значит?' },
      ],
    });
    this.addChild(introModal);
    this.introModal = introModal;
    introModal.selectPageBtn.on('pointerdown', this.showPage);
  }

  private showPage = () => {
    this.introModal.hideModal();
    switch (this.introModal.currentPageName) {
      case this.firstModal.name:
        this.firstModal.showModal();
        this.firstModal.frontRotation(0.5, (rotation) => {
          this.introModal.sprites.star.rotation = rotation;
        });
        break;
      case this.secondModal.name:
        this.secondModal.showModal();
        this.secondModal.frontRotation(0.5, (rotation) => {
          this.introModal.sprites.star.rotation = rotation;
        });
        break;
    }
  };

  private switchToInto = () => {
    this.firstModal.hideModal();
    this.secondModal.hideModal();
    this.introModal.showModal();
    this.introModal.backRotation(0.5, (rotation) => {
      this.secondModal.sprites.star.rotation = rotation;
      this.firstModal.sprites.star.rotation = rotation;
    });
  };

  handleResize(opts: IResizeParams) {
    this.introModal.handleResize(opts);
    this.firstModal.handleResize(opts);
    this.secondModal.handleResize(opts);
  }
}
