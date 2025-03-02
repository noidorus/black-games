import { Sprite, Texture } from 'pixi.js';
import { Button } from './Button';
import { Modal, ModalOptions } from './Modal';
import { TextBox } from './TextBox';

export interface SecondModalOptions extends Omit<ModalOptions, 'title'> {
  visible?: boolean;
}

export class SecondModal extends Modal {
  closeBtn!: Button;
  name: 'secondModal' = 'secondModal';
  private miniStars!: Sprite;
  textBoxOptions = {
    text: `Почему вообще люди ждут конца света?
И почему, если таковой предстоит, он обязательно
должен быть для большинства человеческого рода
ужасным?..
Ответ на первый вопрос состоит, по-видимому,
в том, что существование мира, как подсказывает
людям разум, имеет ценность лишь постольку,
поскольку разумные существа соответствуют
в нем конечной цели своего бытия;
если же последняя оказывается недостижимой, то
сотворенное бытие теряет в их глазах смысл, как
спектакль без развязки и замысла.
Ответ на второй вопрос основывается на мнении
о безнадежной испорченности человеческого рода,
ужасный конец которого представляется
подавляющему большинству людей единственно
соответствующим высшей мудрости и справедливости.`,
    initWidth: 321,
    initHeight: 153,
  };

  constructor(options: SecondModalOptions) {
    super({ ...options, title: 'ДОБРЫЙ ВЕЧЕР' });

    this.setupContent();
  }

  private setupContent() {
    const closeBtn = new Button({ textureName: 'closeBtn' });
    closeBtn.position.set(0, 160);
    this.addChild(closeBtn);
    this.closeBtn = closeBtn;

    this.miniStars = new Sprite(Texture.from('miniStarsRed'));
    this.miniStars.anchor.set(0.5);
    this.miniStars.position.set(0, -128);
    this.addChild(this.miniStars);

    const textBox = new TextBox({ ...this.textBoxOptions, view: this });
    textBox.position.set(-this.textBoxOptions.initWidth / 2, -40);
    this.addChild(textBox);
  }
}
