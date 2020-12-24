import React from 'react';
import styles from './style.less';

interface ArrowProps {
  link?: number[];
  onChange?: Function;
}

const ArrowSelector: React.FC<ArrowProps> = ({ link = [0, 0, 0, 0, 0, 0, 0, 0], onChange }) => {
  const handleArrowClick = (index: number) => {
    const newLink = [...link];
    newLink[index] = 1 - newLink[index];
    if (onChange) {
      onChange(newLink);
    }
  };

  const getArrowClassName = (index: number) => {
    return link[index] ? styles.on : styles.off;
  };

  return (
    <ul className={styles.arrowbox}>
      {[0, 1, 2, 3].map(index => {
        return <li key={index} onClick={() => handleArrowClick(index)} className={getArrowClassName(index)} />
      })}
      <li className={styles.blank} />
      {[4, 5, 6, 7].map(index => {
        return <li key={index} onClick={() => handleArrowClick(index)} className={getArrowClassName(index)} />
      })}
    </ul>
  );
};

export default ArrowSelector;
