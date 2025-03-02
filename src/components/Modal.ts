import { Container, Sprite, Text, TextStyle, Texture, Ticker } from 'pixi.js';
import { Scale } from '../utils/Scale';
import { IResizeParams } from '../interfaces';
import { Resize } from '../utils/Resize';

export interface ModalOptions {
  visible?: boolean;
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
}

type ModalTextures = { infoPlate: Texture; star: Texture };
type ModalSprites = { infoPlate: Sprite; star: Sprite };

export class Modal extends Container {
  options = {
    header: <Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fill' | 'stroke' | 'letterSpacing'>>{
      fontFamily: 'RuslanDisplay',
      fontSize: 96,
      fill: '#39373A',
    },
  };

  subtitleText?: Text;
  static textures: ModalTextures;
  sprites!: ModalSprites;
  rotationSpeed = Math.PI / 3; // 180° / 3с = π / 3 рад/с
  initialWidth = -1;
  initialHeight = -1;

  constructor(options: ModalOptions) {
    super();
    this.preloadTextures();
    this.setup(options);

    if (options.visible != null) {
      this.visible = options.visible;
    }
  }

  private setup({ title, subtitle, width, height }: ModalOptions) {
    this.sprites = {
      infoPlate: new Sprite(Modal.textures.infoPlate),
      star: new Sprite(Modal.textures.star),
    };

    this.sprites.infoPlate.anchor.set(0.5);
    this.sprites.infoPlate.position.set(0, -50);

    this.sprites.star.anchor.set(0.5);
    this.sprites.star.position.set(0, -215);

    this.position.set(window.innerWidth / 2, window.innerHeight / 2);

    this.addChild(this.sprites.infoPlate);
    this.addChild(this.sprites.star);

    const headerText = new Text({ text: title, style: this.options.header });
    headerText.anchor.set(0.5); // Центрируем
    headerText.scale.set(0.5);
    headerText.y = -90;

    Scale.handleWidthHeight(this, width, height);
    this.addChild(headerText);

    if (subtitle) {
      const subtitleText = new Text({
        text: subtitle,
        style: new TextStyle({
          fontFamily: 'AlumniSans',
          fontSize: 96,
          fill: '#39373A',
        }),
      });
      subtitleText.anchor.set(0.5); // Центрируем
      subtitleText.scale.set(0.5);
      subtitleText.y = -10;
      this.addChild(subtitleText);
      this.subtitleText = subtitleText;
    }
  }

  frontRotation(duration: number, callBack?: (rotation: number) => void) {
    const targetRotation = Math.PI; // 180°
    const startRotation = this.sprites.star.rotation;
    const startTime = performance.now();

    const ticker = new Ticker();

    ticker.add(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      this.sprites.star.rotation = startRotation + progress * (targetRotation - startRotation);
      if (progress >= 1) {
        this.sprites.star.rotation = targetRotation;
        ticker.stop();
        callBack?.(targetRotation);
      }
    });

    ticker.start();
  }

  backRotation(duration: number, callBack?: (rotation: number) => void) {
    const startRotation = this.sprites.star.rotation;
    const targetRotation = 0; // Возвращаем в 0°
    const startTime = performance.now();

    const ticker = new Ticker();

    ticker.add(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      this.sprites.star.rotation = startRotation - progress * (targetRotation - startRotation);

      if (progress >= 1) {
        this.sprites.star.rotation = targetRotation;
        ticker.stop();
        callBack?.(targetRotation);
      }
    });

    ticker.start();
  }

  private preloadTextures() {
    if (Modal.textures == null) {
      Modal.textures = {
        infoPlate: Texture.from('infoPlate'),
        star: Texture.from('star'),
      };
    }
  }

  showModal() {
    this.visible = true;
  }

  hideModal() {
    this.visible = false;
  }

  handleResize(options: IResizeParams) {
    if (this.initialWidth === -1) {
      this.initialWidth = this.width;
    }
    if (this.initialHeight === -1) {
      this.initialHeight = this.height;
    }

    Resize.handleResize({
      view: this,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      contentWidth: this.initialWidth,
      contentHeight: this.initialHeight,
    });

    this.x = options.viewWidth / 2;
    this.y = options.viewHeight / 2;
  }
}
