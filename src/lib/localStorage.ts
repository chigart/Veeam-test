import { Label } from '../types';

export const getLabelsArray = (): Label[] => {
  return localStorage.getItem('labels') ? JSON.parse(localStorage.getItem('labels') || '') : [];
}

export const clearLabelsArray = (): void => {
  localStorage.removeItem('labels');
}

export const saveLabelsArray = (array: Label[]): void => {
  localStorage.setItem('labels', JSON.stringify(array));
}

export const deleteLabel = (index: number): void => {
  let labelsArray = getLabelsArray();
  labelsArray = labelsArray.slice(0, index).concat(labelsArray.slice(index + 1, labelsArray.length));
  saveLabelsArray(labelsArray);
}
