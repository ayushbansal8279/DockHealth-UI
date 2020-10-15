import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  padding: 72px ${spacing.huge} 0;
`;

export const LoaderGroup = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 64px;
  }
`;

export const LoaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 22px;
  }
`;

export const CircleLoaderElement = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${palette.coolGrey3};
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
