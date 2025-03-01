import { Container, FederatedWheelEvent, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { ScrollBar } from './ScrollBar';

export interface ITextBoxOptions {
  initWidth: number;
  initHeight: number;
  text: string;
  view: Container;
}

type TextBoxTextures = { bg: Texture };
type TextBoxSprites = { bg: Sprite };

export class TextBox extends Container {
  textMask!: Graphics;
  textContainer!: Container;
  static options = {
    padding: { left: 20, right: 48, top: 12 },
    backgroundColor: '#FFFFFF',
  };
  static textures: TextBoxTextures;
  sprites!: TextBoxSprites;
  scrollBar!: ScrollBar;
  private scrollAmount = 100;

  constructor(opts: ITextBoxOptions) {
    super();
    this.preloadTextures();
    this.setup();
    this.draw(opts);
    this.drawText(opts);
    this.setupEventListeners();
  }

  preloadTextures() {
    if (TextBox.textures == null) {
      TextBox.textures = { bg: Texture.from('textBox') };
    }
  }

  setup() {
    this.sprites = { bg: new Sprite(TextBox.textures.bg) };
    this.addChild(this.sprites.bg);

    const textMask = new Graphics();
    this.addChild(textMask);
    this.textMask = textMask;

    const textContainer = new Container();
    this.addChild(textContainer);
    this.textContainer = textContainer;
  }

  private draw({ initWidth, initHeight }: ITextBoxOptions) {
    const { backgroundColor, padding } = TextBox.options;

    let offsetX = padding.left;
    let offsetY = padding.top;
    const width = initWidth - padding.right;
    const height = initHeight - padding.top * 2;

    this.textMask.position.set(offsetX, offsetY);
    this.textMask.clear();
    this.textMask.rect(0, 0, width, height);
    this.textMask.fill(backgroundColor);
    this.textContainer.mask = this.textMask;
    this.textContainer.position.set(offsetX, offsetY);

    const scrollBar = new ScrollBar({
      onMove: (ratio) => {
        this.textContainer.pivot.y = this.maxPivot * ratio;
      },
      onClick: (delta) => {
        this.scrollContent(this.scrollAmount * delta);
      },
    });
    scrollBar.position.set(initWidth - 30, 9);
    this.addChild(scrollBar);
    this.scrollBar = scrollBar;
  }

  private drawText(opts: ITextBoxOptions) {
    const text = new Text({
      text: opts.text,
      style: new TextStyle({
        fontFamily: 'AnekDevanagari',
        fontSize: 10,
        fill: '#39373A',
      }),
      resolution: window.devicePixelRatio,
    });

    this.textContainer.addChild(text);
  }

  setupEventListeners() {
    this.eventMode = 'static';

    this.on('wheel', (e: FederatedWheelEvent) => this.scrollContent(e.deltaY));
  }

  private scrollContent = (delta: number) => {
    let nextPivot = this.textContainer.pivot.y + delta / 10;

    const { maxPivot } = this;
    nextPivot = Math.max(0, Math.min(nextPivot, maxPivot));
    this.textContainer.pivot.y = nextPivot;

    this.scrollBar.moveWheel(this.textContainer.pivot.y / maxPivot);
  };

  get maxPivot(): number {
    const { padding } = TextBox.options;
    const textHeight = this.textContainer.getBounds().height;
    const maskHeight = this.textMask.getBounds().height - padding.top * 2;
    return Math.max(0, textHeight - maskHeight);
  }
}
