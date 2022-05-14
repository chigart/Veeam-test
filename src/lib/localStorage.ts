import { Params } from '../types/globals';

export const getArray = (): Params[] => {
  return localStorage.getItem('labels') ? JSON.parse(localStorage.getItem('labels') || '') : [];
}

export const clearArray = (): void => {
  localStorage.removeItem('labels');
}
