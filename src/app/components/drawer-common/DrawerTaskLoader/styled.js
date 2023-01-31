import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';

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

export const LoaderElement = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 19px;
    }
  }
`;
