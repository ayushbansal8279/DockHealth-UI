import { withStyles } from '@material-ui/core/styles';
import { ButtonGroup } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const ButtonGroupFlexStyled = withStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    gap: '50px',
  },
})(ButtonGroup);
