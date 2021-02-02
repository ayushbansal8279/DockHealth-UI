import React from 'react';
import SortArrowIcon from 'img/SortArrowIcon';
import { SortArrowContainer } from './styled';

export const SortOrderType = {
  ASC: 'ASC',
  DESC: 'DESC',
  DEFAULT: null,
};

const SortArrow = ({ orderType, onClick = () => {}, isParentHovered }) => {
  return (
    <SortArrowContainer
      type="button"
      onClick={onClick}
      hideIcon={!isParentHovered}
      ordered={!!orderType}
      isUp={orderType === SortOrderType.DESC}
    >
      <SortArrowIcon />
    </SortArrowContainer>
  );
};

export default SortArrow;
