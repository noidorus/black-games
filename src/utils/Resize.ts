import { Container } from 'pixi.js';

export interface HandleResizeParams {
  view: Container;
}

export interface HandleResizeParams {
  view: Container;
  availableWidth: number;
  availableHeight: number;
  contentWidth?: number;
  contentHeight?: number;
  logName?: string;
  lockX?: boolean;
  lockY?: boolean;
  lockWidth?: boolean;
  lockHeight?: boolean;
}

export abstract class Resize {
  static handleResize({
    view,
    availableWidth,
    availableHeight,
    contentWidth = view.width,
    contentHeight = view.height,
    lockWidth = false,
    lockHeight = false,
  }: HandleResizeParams) {
    let occupiedWidth, occupiedHeight;

    if (availableWidth >= contentWidth && availableHeight >= contentHeight) {
      occupiedWidth = contentWidth;
      occupiedHeight = contentHeight;
    } else {
      let scale = 1;
      if (contentHeight >= contentWidth) {
        scale = availableHeight / contentHeight;
        if (scale * contentWidth > availableWidth) {
          scale = availableWidth / contentWidth;
        }
      } else {
        scale = availableWidth / contentWidth;
        if (scale * contentHeight > availableHeight) {
          scale = availableHeight / contentHeight;
        }
      }
      occupiedWidth = Math.floor(contentWidth * scale);
      occupiedHeight = Math.floor(contentHeight * scale);
    }

    if (!lockWidth) {
      view.width = occupiedWidth;
    }

    if (!lockHeight) {
      view.height = occupiedHeight;
    }
  }
}
