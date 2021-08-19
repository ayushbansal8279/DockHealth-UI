/* eslint-disable import/prefer-default-export */
import palette from 'styles/palette';
import MuiAddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

const NODE_HANDLE_SIZE = 14;

export const AddIcon = withStyles({
  root: {
    width: 0.8 * NODE_HANDLE_SIZE,
    height: 0.8 * NODE_HANDLE_SIZE,
    color: palette.white,
    pointerEvents: 'none',
  },
  colorPrimary: {},
})(MuiAddIcon);
