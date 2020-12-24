import React, { useState } from 'react';
import { Attribute, AttributeCn, AttributeColor, AttributeList } from './intreface';
import styles from './style.less';

export const renderAttributeIcon = (attribute: Attribute) => {
  return (
    <div style={{ backgroundColor: AttributeColor[attribute] }}>
      {AttributeCn[attribute]}
    </div>
  );
};

interface AttributeSelectorProps {
  attribute?: Attribute,
  onChange?: Function,
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({ attribute, onChange }) => {
  const [hoverAttribute, setHoverAttribute] = useState(attribute);

  const getClassName = (attributeItem: Attribute) => {
    if (attributeItem === hoverAttribute || attributeItem === attribute) {
      return styles.select;
    }
    return styles.unselect;
  };

  const handleClick = (attributeItem: Attribute) => {
    if (onChange instanceof Function) {
      onChange(attributeItem);
    }
  }

  return (
    <ul className={styles['attribute-box']}>
      {AttributeList.map((attributeItem: Attribute) => {
        return (
          <li
            key={attributeItem}
            style={{ backgroundColor: AttributeColor[attributeItem] }}
            className={getClassName(attributeItem)}
            onMouseOver={() => setHoverAttribute(attributeItem)}
            onMouseOut={() => setHoverAttribute(attribute)}
            onClick={() => handleClick(attributeItem)}
          >
            {renderAttributeIcon(attributeItem)}
          </li>
        );
      })}
    </ul>
  );
};

export default AttributeSelector;
