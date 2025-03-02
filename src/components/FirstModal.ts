import { Sprite, Texture } from 'pixi.js';
import { Button } from './Button';
import { Modal, ModalOptions } from './Modal';

export interface IntroModalOptions extends Omit<ModalOptions, 'title'> {
  visible?: boolean;
}

export class FirstModal extends Modal {
  closeBtn!: Button;
  name: 'firstModal' = 'firstModal';
  private miniStars!: Sprite;

  constructor(options?: IntroModalOptions) {
    super({ ...options, title: 'ДОБРЫЙ ВЕЧЕР', subtitle: 'вот и думайте' });
    this.setupContent();
  }

  private setupContent() {
    const closeBtn = new Button({ textureName: 'closeBtn' });
    closeBtn.position.set(0, 110);
    this.addChild(closeBtn);
    this.closeBtn = closeBtn;

    this.miniStars = new Sprite(Texture.from('miniStarsLight'));
    this.miniStars.anchor.set(0.5);
    this.miniStars.position.set(0, -128);
    this.addChild(this.miniStars);
  }
}
