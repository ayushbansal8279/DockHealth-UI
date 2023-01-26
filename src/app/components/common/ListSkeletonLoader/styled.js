import { Skeleton } from '@mui/lab';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const LoaderRowContainer = styled.div`
  overflow: hidden;
`;
export const LoaderRow = styled(Skeleton)`
  &&& {
    .MuiSkeleton-root {
      margin: ${spacing.small} 0;
    }
  }
`;
