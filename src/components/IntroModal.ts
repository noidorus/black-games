import { Modal, ModalOptions } from './Modal';
import { Button } from './Button';

export interface IntroModalOptions extends Omit<ModalOptions, 'title'> {
  visible?: boolean;
  pages: { name: string; text: string }[];
}

export class IntroModal extends Modal {
  selectPageBtn!: Button;
  name: 'introModal' = 'introModal';
  private pages: { name: string; text: string }[];
  private currentPage: number = 0;
  nextBtn!: Button;
  prevBtn!: Button;

  constructor({ pages, ...options }: IntroModalOptions) {
    super({ ...options, title: 'ДОБРЫЙ ВЕЧЕР', subtitle: pages[0].text, width: 540 });
    this.pages = pages;
    this.setupContent();
  }

  get currentPageName() {
    return this.pages[this.currentPage].name;
  }

  private setupContent() {
    const selectPageBtn = new Button({ textureName: 'startBtn', text: 'ВЫБРАТЬ' });
    selectPageBtn.y = 90;
    this.addChild(selectPageBtn);
    this.selectPageBtn = selectPageBtn;

    const nextBtn = new Button({
      textureName: 'arrowRight',
      onClick: () => {
        this.currentPage = (this.currentPage + 1) % this.pages.length;
        if (this.subtitleText) {
          this.subtitleText.text = this.pages[this.currentPage].text;
        }
      },
    });
    nextBtn.position.set(174, 90);
    this.addChild(nextBtn);
    this.nextBtn = nextBtn;

    const prevBtn = new Button({
      textureName: 'arrowLeft',
      onClick: () => {
        this.currentPage = (this.currentPage - 1 + this.pages.length) % this.pages.length;
        if (this.subtitleText) {
          this.subtitleText.text = this.pages[this.currentPage].text;
        }
      },
    });
    prevBtn.position.set(-174, 90);
    this.addChild(prevBtn);
    this.prevBtn = prevBtn;
  }
}
