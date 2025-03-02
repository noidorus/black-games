import { Container, FederatedPointerEvent, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Scale } from '../utils/Scale';

export interface ButtonOptions {
  pressed?: boolean;
  externalPressed?: boolean;
  width?: number;
  height?: number;
  textureName: string;
  text?: string;
  onClick?: (e: FederatedPointerEvent) => void;
}

export class Button extends Container {
  pressed = false;
  texture!: Texture;
  sprite!: Sprite;
  onClick!: ButtonOptions['onClick'];
  options = {
    btnText: <Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fill' | 'stroke' | 'letterSpacing'>>{
      fontFamily: 'RuslanDisplay',
      fontSize: 64,
      fill: '#F4F5F0',
    },
  };

  constructor(options: ButtonOptions) {
    super();
    this.preloadTextures(options.textureName);

    if (options.pressed != null) {
      this.pressed = options.pressed;
    }

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.onClick = options.onClick;

    this.setup(options);
  }

  private preloadTextures(name: string) {
    this.texture = Texture.from(name);
  }

  private setup({ text, width, height }: ButtonOptions) {
    this.sprite = new Sprite({ texture: this.texture, width, height });
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    if (text) {
      const btnText = new Text({ text, style: this.options.btnText });
      btnText.anchor.set(0.5); // Центрируем
      btnText.scale.set(0.5);
      btnText.y = -5;
      this.addChild(btnText);
    }

    Scale.handleWidthHeight(this, width, height);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.on('pointerdown', (e) => {
      if (typeof this.onClick === 'function') {
        this.onClick(e);
      }
      this.updateState(false, true);
    });

    this.on('pointerover', () => {
      this.updateState(true, false);
    });

    this.on('pointerup', () => {
      this.updateState(false, false);
    });

    this.on('pointerleave', () => {
      this.updateState(false, false);
    });
  }

  private updateState(hovered = false, pressed = false) {
    if (pressed) {
      this.pressedState();
    } else {
      if (hovered) {
        this.hoverState();
      } else {
        this.idleState();
      }
    }
  }

  private idleState() {
    this.scale.set(1);
  }

  private hoverState() {
    this.scale.set(1.05);
  }

  private pressedState() {
    this.scale.set(0.95);
  }
}
