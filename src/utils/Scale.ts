import { Container } from 'pixi.js';

export abstract class Scale {
  static handleWidthHeight(object: Container, width?: number, height?: number) {
    const isWidth = Number.isFinite(width);
    const isHeight = Number.isFinite(height);

    if (isWidth && isHeight) {
      object.width = <number>width;
      object.height = <number>height;
    } else if (isWidth && !isHeight) {
      object.width = <number>width;
      object.scale.y = object.scale.x;
    } else if (!isWidth && isHeight) {
      object.height = <number>height;
      object.scale.x = object.scale.y;
    }
  }
}
