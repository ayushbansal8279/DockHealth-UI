import React from 'react';
import SortArrowIcon from 'img/SortArrowIcon';
import { SortOrderType } from 'helpers/sorting-helper';
import { SortArrowContainer } from './styled';

const SortArrow = ({ orderType, onClick = () => {}, isParentHovered }) => {
  return (
    <SortArrowContainer
      type="button"
      onClick={onClick}
      hideIcon={!isParentHovered}
      ordered={!!orderType}
      isUp={orderType === SortOrderType.ASC}
    >
      <SortArrowIcon />
    </SortArrowContainer>
  );
};

export default SortArrow;
