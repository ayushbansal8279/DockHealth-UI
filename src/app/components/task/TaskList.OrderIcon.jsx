import { find, propEq } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import SortingIcon from 'img/sorting-icon.svg';

const OrderIconContainer = styled.span`
  margin-left: 0.25rem;
`;

const OrderIconImage = styled.img`
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
  transition: transform 0.25s ease-out;
`;

export default ({ sortingKey, sorting }) => {
  let order = 'asc';
  if (sortingKey && sorting) {
    const colAttributes = find(propEq('key', sortingKey), sorting);
    if (colAttributes) {
      order = colAttributes;
    }
  }

  return (
    <OrderIconContainer>
      <OrderIconImage
        rotated={order === 'desc'}
        src={SortingIcon}
        alt="Sort icon"
      />
    </OrderIconContainer>
  );
};
