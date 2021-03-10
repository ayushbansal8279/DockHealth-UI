import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LoaderRowContainer = styled.div`
  overflow: hidden;
`;

export const LoaderRow = styled.div`
  height: 19px;
  width: 100%;
  margin: ${spacing.small} 0;
  background-color: ${palette.skeletonLoader};
`;

export const LoaderHeader = styled(LoaderRow)`
  height: 29px;
`;
