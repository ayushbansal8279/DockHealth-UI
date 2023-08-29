import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LoaderText = styled.div`
  height: 19px;
  width: ${({ width }) => (width ? `${width}px` : '169px')};
  background-color: ${palette.coolGrey3};

  &:not(:last-of-type) {
    margin-right: ${spacing.smallExtraPlus};
  }
`;

export const LoaderRow = styled.div`
  display: flex;
  flex-direction: row;
`;
