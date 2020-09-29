import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LoaderContainer = styled.div`
  padding: 0 ${spacing.giga};
`;

export const LoaderText = styled.div`
  height: 19px;
  width: ${({ width }) => (width ? `${width}px` : '118px')};
  background-color: ${palette.coolGrey3};

  &:not(:last-of-type) {
    margin-right: ${spacing.smallExtraPlus};
  }
`;
