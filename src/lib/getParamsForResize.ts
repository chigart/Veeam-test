import { Params } from '../types/globals';
import { inputBarHeight } from './constants';

const getParamsForResize = (dimensions: Params) => {
  const windowParams = {
    width: window.innerWidth,
    height: window.innerHeight - inputBarHeight
  };

  const aspectRatio = dimensions.width / dimensions.height;
  let width, height;
  if (aspectRatio >= 1) {
    width = dimensions.width >= windowParams.width ? windowParams.width : dimensions.width;
    height = Math.round(width / aspectRatio);
    if (height > windowParams.height) {
      height = windowParams.height;
      width = Math.round(windowParams.height * aspectRatio);
    }
  }
  else {
    height = dimensions.height >= windowParams.height ? windowParams.height : dimensions.height;
    width = Math.round(height * aspectRatio);
    if (width > windowParams.width)
    {
      width = windowParams.width;
      height = Math.round(windowParams.width / aspectRatio);
    }
  }

  return { width, height };
}

export default getParamsForResize;
