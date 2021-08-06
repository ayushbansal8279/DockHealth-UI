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
  /* border: 2px solid black; */
  box-shadow: 4px 2px 2px 0px rgba(0, 0, 0, 0.1),
    4px 2px 3px 4px rgba(0, 0, 0, 0.07), 4px 2px 6px 4px rgba(0, 0, 0, 0.06);
  /* box-shadow: 5px 5px 5px 5px black; */
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 8px;
  margin-bottom: 8px;
`;
