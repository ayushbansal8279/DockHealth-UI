import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';

export const AlertLoader = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 15px;
      border-radius: 4px;

      &:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
`;
