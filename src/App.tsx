import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import axios from 'axios';
import getParamsForResize from './lib/getParamsForResize';
import { Params } from './types/globals';
import { clearArray, getArray } from './lib/localStorage';
import { getRelativePosition } from './lib/getRelativePosition';
import { inputBarHeight } from './lib/constants';

const App: React.FC = (): JSX.Element => {
  const [imageParams, setImageParams] = useState<Params>();
  const [labels, setLabels] = useState<Params[]>();

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

  const onClickHandler = (event: React.MouseEvent<HTMLImageElement>): void => {
    const array: Params[] = getArray() || [];
    setLabels(array);
    if (imageParams) {
      array.push(getRelativePosition({ width: event.clientX, height: event.clientY }, imageParams));
    }
    localStorage.setItem('labels', JSON.stringify(array));
  }

  const onDeleteHandler = () => {
    axios.delete("http://localhost:5000/delete").then(() => {
      setImageParams(undefined);
      clearArray();
      setLabels([]);
    });
  }

  const resizeImage = async () => {
    if (window.innerWidth && window.innerHeight && imageParams) {
      await axios.post("http://localhost:5000/resize", getParamsForResize(imageParams));
    }
  }

  useEffect(() => {
    axios.get("http://localhost:5000/info").then((res) => {
      setImageParams(res.data);
    });
    setLabels(getArray());
  }, []);

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
            style={{ top: `${height}%`, left: `${width}%`, zIndex: index + 1, backgroundColor: `rgb(${index * 10 + 100}, 0, 0)` }}
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
