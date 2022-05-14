import { Params } from '../types';
import { defaultImageSize, inputBarHeight } from './constants';
import getParamsForResize from './getParamsForResize';

export const getRelativePosition = (clickPosition: Params, imageParams: Params = defaultImageSize): Params => {
  const resizedImageParams = getParamsForResize(imageParams);
  const windowParams = {
    width: window.innerWidth,
    height: window.innerHeight - inputBarHeight
  };
  const relativeWidth = Math.round((clickPosition.width - (windowParams.width - resizedImageParams.width) / 2)
    / resizedImageParams.width * 100);
  const relativeHeight = Math.round((clickPosition.height - inputBarHeight) / resizedImageParams.height * 100);

  return { width: relativeWidth, height: relativeHeight };
}
