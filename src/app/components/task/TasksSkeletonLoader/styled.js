import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';

export const LoaderRow = styled.div`
  display: flex;
  height: 35px;
  margin-top: 2px;
  flex-direction: row;
  align-items: center;
`;

export const LoaderElement = styled(Skeleton)`
  &&& {
    .MuiSkeleton-root {
      height: 19px;
      width: '100%';
    }
  }
`;
