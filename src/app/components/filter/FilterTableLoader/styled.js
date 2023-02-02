import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';

export const FilterOptionLoader = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 30px;
      border-radius: 4px;

      &:not(:last-of-type) {
        margin-bottom: 4px;
      }
    }
  }
`;
