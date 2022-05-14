import { Params } from '../types';
import { defaultImageSize, inputBarHeight } from './constants';

const getParamsForResize = (imageParams: Params = defaultImageSize) => {
  const windowParams = {
    width: window.innerWidth,
    height: window.innerHeight - inputBarHeight
  };
  const aspectRatio = imageParams.width / imageParams.height;
  let width, height;
  
  if (aspectRatio >= 1) {
    width = (imageParams.width >= windowParams.width) ? windowParams.width : imageParams.width;
    height = Math.round(width / aspectRatio);
    if (height > windowParams.height) {
      height = windowParams.height;
      width = Math.round(windowParams.height * aspectRatio);
    }
  }
  else {
    height = (imageParams.height >= windowParams.height) ? windowParams.height : imageParams.height;
    width = Math.round(height * aspectRatio);
    if (width > windowParams.width) {
      width = windowParams.width;
      height = Math.round(windowParams.width / aspectRatio);
    }
  }

  return { width, height };
}

export default getParamsForResize;
