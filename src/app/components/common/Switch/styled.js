import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';

export const StyledSwitch = withStyles({
  switchBase: {
    color: palette.coolGrey4,
    '&$checked': {
      color: palette.darkBlue,
    },
    '&$checked + $track': {
      backgroundColor: 'rgba(33, 109, 194, 0.38)',
    },
  },
  checked: {},
  track: {},
})(Switch);

export default StyledSwitch;
