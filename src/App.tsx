import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import axios from 'axios';
import getParamsForResize from './lib/getParamsForResize';
import { clearLabelsArray, getLabelsArray, saveLabelsArray } from './lib/localStorage';
import { getRelativePosition } from './lib/getRelativePosition';
import { inputBarHeight } from './lib/constants';
import { Params, Label } from './types';
import { deleteLabel } from './lib/localStorage';
import Labels from './components/Labels';

const App: React.FC = (): JSX.Element => {
  const [imageParams, setImageParams] = useState<Params>();
  const [labels, setLabels] = useState<Label[]>();
  const [labelText, setLabelText] = useState('');

  const onChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const data = new FormData();
      data.append('file', files[0]);
      await axios.post("http://localhost:5000/upload", data).then((res) => {
        axios.post("http://localhost:5000/resize", getParamsForResize(res.data));
      });
    }
  }

  const onDeleteHandler = (): void => {
    axios.delete("http://localhost:5000/delete").then(() => {
      setImageParams(undefined);
      clearLabelsArray();
      setLabels([]);
    });
  }

  const onClickHandler = (event: React.MouseEvent<HTMLImageElement>): void => {
    const array: Label[] = getLabelsArray();
    setLabels(array);
    array.push(getRelativePosition({ x: event.clientX, y: event.clientY, text: labelText }, imageParams));
    saveLabelsArray(array);
  }

  const onLabelClick = (index: number): void => {
    deleteLabel(index);
    setLabels(getLabelsArray());
  }

  const resizeImage = async () => {
    await axios.post("http://localhost:5000/resize", getParamsForResize(imageParams));
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && imageParams) {
      window.addEventListener('resize', resizeImage)
    }

    return function cleanup() {
      window.removeEventListener('resize', resizeImage)
    }
  })

  useEffect(() => {
    axios.get("http://localhost:5000/info").then((res) => {
      setImageParams(res.data);
      if (res.data) {
        axios.post("http://localhost:5000/resize", getParamsForResize(res.data));
      }
    });
    setLabels(getLabelsArray());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.input} style={{ height: inputBarHeight }}>
        { !imageParams ?
          <input type="file" name="file" onChange={onChangeHandler}/> :
          <button type='button' onClick={onDeleteHandler}>
            Delete image
          </button>
        }
        <h5>
          Max size 1MB / Type your text and click
        </h5>
        <input
          type='text'
          placeholder='type your label'
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
        />
      </div>
      <div className={styles.wrapper}>
        { imageParams &&
          <img
            src='/uploadedFileResized.jpg'
            alt='uploaded by user'
            onClick={onClickHandler}
            onError={resizeImage}
          />
        }

        <Labels labels={labels} onLabelClick={onLabelClick}/>
      </div>
    </div>
  );
}

export default App;
