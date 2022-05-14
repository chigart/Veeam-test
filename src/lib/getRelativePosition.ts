import { Params } from '../types/globals';
import { inputBarHeight } from './constants';

export const getRelativePosition = (clickPosition: Params, imageParams: Params) => {
  console.log('clickPosition', clickPosition);
  console.log('imageParams', imageParams);
  const windowParams = {
    width: window.innerWidth,
    height: window.innerHeight - inputBarHeight
  };
  console.log('windowParams', windowParams);
  const relativeWidth = Math.round((clickPosition.width - (windowParams.width - imageParams.width) / 2) / imageParams.width * 100);
  const relativeHeight = Math.round((clickPosition.height - inputBarHeight) / imageParams.height * 100);

  return { width: relativeWidth, height: relativeHeight };
}
