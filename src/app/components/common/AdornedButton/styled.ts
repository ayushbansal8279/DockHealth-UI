import { makeStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';

export const useAdornedButtonClasses = makeStyles({
  root: {
    backgroundColor: palette.white,
    border: `0.0625rem solid ${palette.coolGrey3}`,
    borderRadius: 0,
    height: '2.75rem',
    whiteSpace: 'nowrap',
  },
  label: {
    alignItems: 'center',
    color: palette.brightBlue,
    fontSize: '1.1875rem',
    display: 'flex',
    padding: '0 0.75rem',
  },
  adornment: {
    alignItems: 'center',
    borderRight: `0.0625rem solid ${palette.coolGrey3}`,
    color: palette.coolGrey1,
    display: 'flex',
    height: '2.75rem',
    justifyContent: 'center',
    padding: 0,
    width: '2.75rem',
  },
});
