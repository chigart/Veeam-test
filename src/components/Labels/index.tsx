import React from 'react';
import styles from '../../App.module.scss';
import { Label } from '../../types';

interface LabelsProps {
  labels?: Label[],
  onLabelClick: (index: number) => void,
}
const Labels:React.FC<LabelsProps> = (props): JSX.Element => {
  const { labels, onLabelClick } = props;

  return (
    <>
      { labels?.map(({ x, y, text }, index) => (
        <div
          key={index}
          className={styles.label}
          onClick={() => onLabelClick(index)}
          style={{
            top: `${y}%`,
            left: `${x}%`,
            zIndex: index + 1,
            backgroundColor: `rgb(${index * 10 + 100}, ${200 - index * 10}, 255)`
          }}
        >
          { text || 'Label' }
        </div>
      ))
      }
    </>
  );
};

export default Labels;
