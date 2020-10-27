import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  padding: 0 55px 5px 55px;
`;

export const LoaderGroup = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 86px;
  }
`;

export const LoaderRow = styled.div`
  display: flex;
  flex-direction: row;

  &:not(:last-of-type) {
    margin-bottom: ${spacing.regularPlus};
  }
`;

export const LoaderElement = styled.div`
  height: 19px;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  background-color: ${palette.coolGrey3};
`;

export const LoaderFillElement = styled(LoaderElement)`
  flex: 1;
  width: auto;
`;
