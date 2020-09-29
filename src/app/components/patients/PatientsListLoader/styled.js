import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LoaderContainer = styled.div`
  padding: 77px 74px 74px;
`;

export const LoaderRow = styled.div`
  display: grid;
  grid-template-columns: 0.4fr 0.15fr 0.15fr 0.15fr 0.15fr 19px;
  grid-gap: ${spacing.giga};
  height: 19px;

  &:not(:last-child) {
    margin-bottom: ${spacing.huge};
  }
`;

export const LoaderCell = styled.div`
  background-color: ${palette.coolGrey3};
`;
