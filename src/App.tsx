import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import axios from 'axios';
import getParamsForResize from './lib/getParamsForResize';
import { clearLabelsArray, getLabelsArray } from './lib/localStorage';
import { getRelativePosition } from './lib/getRelativePosition';
import { inputBarHeight } from './lib/constants';
import { Params } from './types';

const App: React.FC = (): JSX.Element => {
  const [imageParams, setImageParams] = useState<Params>();
  const [labels, setLabels] = useState<Params[]>();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const data = new FormData();
      data.append('file', files[0]);
      axios.post("http://localhost:5000/upload", data).then((res) => {
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
    const array: Params[] = getLabelsArray();
    setLabels(array);
    array.push(getRelativePosition({ width: event.clientX, height: event.clientY }, imageParams));
    localStorage.setItem('labels', JSON.stringify(array));
  }

  useEffect(() => {
    axios.get("http://localhost:5000/info").then((res) => setImageParams(res.data));
    setLabels(getLabelsArray());
  }, []);

  const resizeImage = () => {
    axios.post("http://localhost:5000/resize", getParamsForResize(imageParams));
  }

  if (typeof window !== 'undefined' && imageParams) {
    window.onresize = resizeImage;
  }

  return (
    <div className={styles.container}>
      <div className={styles.input} style={{ height: inputBarHeight }}>
        { !imageParams ?
          <input type="file" name="file" onChange={onChangeHandler}/> :
          <button type='button' onClick={onDeleteHandler}>
            Delete image
          </button>
        }
      </div>
      <div className={styles.wrapper}>
        { imageParams &&
          <img
            src='/uploadedFileResized.jpg'
            alt='uploaded by user'
            onClick={onClickHandler}
          />
        }

        { labels?.map(({ width, height }, index) => (
          <div
            key={index}
            className={styles.label}
            style={{
              top: `${height}%`,
              left: `${width}%`,
              zIndex: index + 1,
              backgroundColor: `rgb(${index * 10 + 100}, ${200 - index * 10}, 255)`
            }}
          >
            'Label'
          </div>
        ))
        }
      </div>
    </div>
  );
}

export default App;
