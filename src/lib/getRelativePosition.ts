import { Params, Label } from '../types';
import { defaultImageSize, inputBarHeight } from './constants';
import getParamsForResize from './getParamsForResize';

export const getRelativePosition = (clickPosition: Label, imageParams: Params = defaultImageSize): Label => {
  const resizedImageParams = getParamsForResize(imageParams);
  const windowParams = {
    width: window.innerWidth,
    height: window.innerHeight - inputBarHeight
  };
  const relativeWidth = Math.round((clickPosition.x - (windowParams.width - resizedImageParams.width) / 2)
    / resizedImageParams.width * 100);
  const relativeHeight = Math.round((clickPosition.y - inputBarHeight) / resizedImageParams.height * 100);

  return { x: relativeWidth, y: relativeHeight, text: clickPosition.text };
}
