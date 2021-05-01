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

export const LoaderElement = styled.div`
  height: 19px;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  background-color: ${palette.skeletonLoader};
`;
