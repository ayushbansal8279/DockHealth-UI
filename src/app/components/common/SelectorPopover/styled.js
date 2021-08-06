/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const ItemsList = styled.div`
  max-height: ${props => props.listMaxHeight};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: ${props =>
    props.withPadding ? `${spacing.large} ${spacing.largePlus}` : ''};
`;

export const ShadowWrapper = styled.div`
  border: 2px solid black;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
