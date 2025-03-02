import { Container, FederatedPointerEvent, Sprite, Texture } from 'pixi.js';
import { Button } from './Button';

interface IScrollBarOptions {
  onMove?: (ratio: number) => void;
  onClick?: (delta: number) => void;
}

type ScrollBarTextures = { controlsBg: Texture };
type ScrollBarSprites = { controlsBg: Sprite };

export class ScrollBar extends Container {
  static textures: ScrollBarTextures;
  isDragging: boolean = false;
  sprites!: ScrollBarSprites;
  private dragStartY = 0;
  btnUp!: Button;
  btnDown!: Button;
  wheel!: Button;
  scrollRatio = 0;
  onMove?: (ratio: number) => void;
  onClick?: (delta: number) => void;

  private static prelaodTextures() {
    if (ScrollBar.textures == null) {
      ScrollBar.textures = {
        controlsBg: Texture.from('controlsBg'),
      };
    }
  }

  constructor(opts: IScrollBarOptions) {
    super();
    ScrollBar.prelaodTextures();
    this.onMove = opts.onMove;
    this.onClick = opts.onClick;
    this.setup();
    this.setupEventListeners();
  }

  private setup() {
    this.sprites = { controlsBg: new Sprite(ScrollBar.textures.controlsBg) };
    this.addChild(this.sprites.controlsBg);

    const btnDown = new Button({
      textureName: 'arrowSmall',
      width: 16,
      height: 16,

      onClick: () => {
        if (this.onClick) {
          this.onClick(-1);
        }
      },
    });
    btnDown.position.set(this.width / 2, 10);
    this.addChild(btnDown);
    this.btnDown = btnDown;

    const btnUp = new Button({
      textureName: 'arrowSmall',
      width: 16,
      height: 16,
      onClick: () => {
        if (this.onClick) {
          this.onClick(1);
        }
      },
    });
    btnUp.position.set(this.width / 2, this.height - 10);
    btnUp.rotation = Math.PI;
    this.addChild(btnUp);
    this.btnUp = btnUp;

    const wheel = new Button({ textureName: 'wheel' });
    wheel.x = this.width / 2;
    wheel.y = wheel.height;
    this.wheel = wheel;
    this.addChild(wheel);
  }

  private setupEventListeners() {
    this.wheel.on('pointerdown', this.onDragStart);
    this.wheel.on('pointerup', this.onDragEnd);
    this.wheel.on('pointerupoutside', this.onDragEnd);
    this.wheel.on('pointermove', this.onDragMove);
  }

  private onDragStart = (event: FederatedPointerEvent) => {
    this.isDragging = true;
    this.dragStartY = event.global.y - this.wheel.y;
  };

  private onDragEnd = () => {
    this.isDragging = false;
  };

  moveWheel(scrollRatio: number) {
    const minY = this.wheel.getBounds().height;
    const maxY = this.height - this.wheel.getBounds().height;
    this.wheel.y = minY + scrollRatio * (maxY - minY);
  }

  private onDragMove = (event: FederatedPointerEvent) => {
    if (!this.isDragging) return;
    let newY = event.global.y - this.dragStartY;

    const minY = this.wheel.getBounds().height;
    const maxY = this.height - this.wheel.getBounds().height;

    newY = Math.max(minY, Math.min(newY, maxY));

    this.wheel.y = newY;

    const scrollRatio = (newY - minY) / (maxY - minY);
    this.onMove?.(scrollRatio);
  };
}
