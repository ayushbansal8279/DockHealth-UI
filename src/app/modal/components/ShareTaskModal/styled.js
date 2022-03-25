/* eslint-disable import/prefer-default-export */
import palette from 'styles/palette';
import { makeStyles } from '@material-ui/core/styles';

export const useAutocompleteStyles = makeStyles({
  root: {
    width: '100%',
  },
  inputRoot: {
    width: '100%',
    paddingRight: '0 !important',
  },
  input: {
    width: '100% !important',
    padding: '24px 24px',
    background: palette.coolGrey4,
    border: 'none',
    outline: 'none',
  },
});
