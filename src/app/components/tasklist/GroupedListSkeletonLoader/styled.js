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
  height: 35px;
  margin-bottom: 3px;
  flex-direction: row;
  align-items: center;
`;

export const CircleLoaderElement = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${palette.skeletonLoader};
`;

export const LoaderElement = styled.div`
  height: 19px;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  background-color: ${palette.skeletonLoader};
`;

export const LoaderFillElement = styled(LoaderElement)`
  flex: 1;
  width: auto;
`;
