/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props =>
    props.withPadding ? `${spacing.large} ${spacing.largePlus}` : ''};
`;
