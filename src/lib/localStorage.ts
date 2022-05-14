import { Params } from '../types';

export const getLabelsArray = (): Params[] => {
  return localStorage.getItem('labels') ? JSON.parse(localStorage.getItem('labels') || '') : [];
}

export const clearLabelsArray = (): void => {
  localStorage.removeItem('labels');
}
