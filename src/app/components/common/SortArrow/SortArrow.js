import React from 'react';
import ArrowIconGrey from 'img/arrow-grey.svg';
import ArrowIconWhite from 'img/arrow-white';
import { SortArrowContainer, ArrowIcon } from './styled';

export const SORT_ORDER_TYPES = {
  asc: 'ASC',
  desc: 'DESC',
  default: null,
};

const SortArrow = ({ orderType, onClick, isParentHovered }) => {
  return (
    <SortArrowContainer
      type="button"
      onClick={onClick}
      withBackground={!!orderType}
      hideIcon={!isParentHovered}
    >
      <ArrowIcon
        src={orderType ? ArrowIconWhite : ArrowIconGrey}
        isUp={orderType === SORT_ORDER_TYPES.desc}
        alt="arrow"
      />
    </SortArrowContainer>
  );
};

export default SortArrow;
