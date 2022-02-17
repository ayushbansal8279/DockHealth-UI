import React from 'react';
import SortArrowIcon from 'img/SortArrowIcon';
import { SortOrderType } from 'helpers/sorting-helper';
import { CircleContainer, SortArrowContainer } from './styled';

const SortArrow = ({ orderType, onClick = () => {}, isParentHovered }) => {
  return (
    <CircleContainer ordered={!!orderType}>
      <SortArrowContainer
        onClick={onClick}
        hideIcon={!isParentHovered}
        ordered={!!orderType}
        isUp={orderType === SortOrderType.ASC}
      >
        <SortArrowIcon />
      </SortArrowContainer>
    </CircleContainer>
  );
};

export default SortArrow;
