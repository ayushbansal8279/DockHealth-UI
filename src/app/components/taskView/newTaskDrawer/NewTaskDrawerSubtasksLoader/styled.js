import styled from 'styled-components';
import palette from 'styles/palette';

export const LoaderGroup = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 86px;
  }
`;

export const LoaderRow = styled.div`
  display: flex;
  height: 35px;
  flex-direction: row;
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 3px;
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

export const CircleLoaderElement = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${palette.coolGrey3};
`;
