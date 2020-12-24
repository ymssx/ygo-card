import React, { useState, useRef, useEffect } from 'react';
import { Card, config as defaultConfig } from 'ygo-card';
import { Card as CardInterface } from '@/utils/interface';
import { getCardData, getCardImageUrl } from '@/utils/api';
import './style.less';

interface cardBoxProps {
  data?: object;
  id?: string;
  size?: number | number[];
  config?: object;
  onCreated?: Function;
  onLoaded?: Function;
}

const CardBox: React.FC<cardBoxProps> = (props: cardBoxProps) => {
  let { data, id, size = [813, 1185], config = defaultConfig, onCreated, onLoaded } = props;
  const [cardData, setCardData] = useState(data);
  const [card, setCard] = useState<CardInterface>();

  const canvas = useRef(null);

  const renderCard = (localData: any) => {
    if (!localData) {
      return;
    }

    const newCard = new Card({
      data: localData,
      config: config,
      size: Array.isArray(size) ? size : [size, size / 813 * 1185],
      canvas: canvas.current,
      moldPath: '/mold',
      fontsLoaded: onLoaded,
      getPic: getCardImageUrl,
    });

    newCard.render();

    setCard(newCard);

    if (onCreated instanceof Function) {
      onCreated(newCard);
    }
  };

  useEffect(() => {
    renderCard(data);
  }, [canvas]);

  useEffect(() => {
    if (card) {
      card.changeConfig(config);
    }
  }, [config]);

  useEffect(() => {
    if (!id) {
      return;
    }

    getCardData(id).then(newData => {
      setCardData(newData);
    });
  }, [id]);

  useEffect(() => setCardData(data), [data])

  useEffect(() => {
    if (!card) {
      // renderCard(cardData);
    } else {
      card.feedData(cardData);
    }
  }, [cardData]);

  return (
    <canvas ref={canvas} />
  );
}

export default CardBox;
