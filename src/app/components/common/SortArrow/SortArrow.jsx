import React from 'react';
import { SortOrderType } from 'helpers/sorting-helper';
import { CircleContainer, SortArrowContainer } from './styled';
import SortAscend from 'img/SortAscend';
import SortDecend from 'img/SortDecend';

const SortArrow = ({ orderType }) => {
  return (
    <CircleContainer>
      <SortArrowContainer>
        {orderType === SortOrderType.ASC ? <SortAscend /> : <SortDecend />}
      </SortArrowContainer>
    </CircleContainer>
  );
};

export default SortArrow;
