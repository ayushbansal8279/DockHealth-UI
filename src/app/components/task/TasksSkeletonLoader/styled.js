import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

export const LoaderRow = styled.div`
  display: flex;
  height: 35px;
  margin-top: 2px;
  flex-direction: row;
  align-items: center;
`;

export const LoaderElement = withStyles({
  root: {
    height: 19,
    width: '100%',
  },
})(Skeleton);
