import { withStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
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

export const LoaderElement = withStyles({
  root: {
    height: 19,
  },
})(Skeleton);
