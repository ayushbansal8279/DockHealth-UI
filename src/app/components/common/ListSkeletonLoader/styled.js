import { Skeleton } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const LoaderRowContainer = styled.div`
  overflow: hidden;
`;
export const LoaderRow = withStyles({
  root: {
    margin: `${spacing.small} 0`,
  },
})(Skeleton);
