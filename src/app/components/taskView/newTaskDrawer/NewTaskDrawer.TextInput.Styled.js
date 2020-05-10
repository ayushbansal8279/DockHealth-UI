import palette from 'styles/palette';

const FONT_FAMILY = '"Roboto Condensed", sans-serif';
const BORDER = '0.0625rem solid transparent';
// const MIN_INPUT_HEIGHT = '4rem';
const ANIMATION = 'all 0.2s ease-out';

const styles = {
  root: {
    border: BORDER,
    borderBottomColor: palette.coolGrey2,
    borderRadius: 0,
    fontFamily: FONT_FAMILY,
    height: '100%',
    transition: ANIMATION,
    zIndex: 1,
    marginBottom: '7px',
    boxShadow: 'none',
    '& label': {
      color: palette.coolGrey2,
    },
    '& label.Mui-focused': {
      color: palette.coolGrey1,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: palette.coolGrey2,
    },
    '& .MuiInput-input': {
      boxShadow: 'none',
    },
    '& label + .MuiInput-formControl': {
      marginTop: '2px',
    },
    '& .MuiInputBase-inputMultiline': {
      height: '24px',
      minHeight: '24px',
    },
  },
  rootSelect: {
    border: BORDER,
    borderBottomColor: palette.coolGrey2,
    borderRadius: 0,
    fontFamily: FONT_FAMILY,
    height: '100%',
    transition: ANIMATION,
    zIndex: 1,
    marginBottom: '0px',
    boxShadow: 'none',
    '& label': {
      color: palette.coolGrey2,
    },
    '& label.Mui-focused': {
      color: palette.coolGrey1,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: palette.coolGrey2,
    },
    '& .MuiInput-input': {
      boxShadow: 'none',
    },
    '& label + .MuiInput-formControl': {
      marginTop: '16px',
    },
    '& .MuiInputBase-inputMultiline': {
      height: '24px',
      minHeight: '24px',
    },
  },
  error: {
    border: BORDER,
    borderBottomColor: palette.error,
  },
  focused: {
    border: BORDER,
    borderBottomColor: palette.coolGrey2,
    '&$error': {
      border: BORDER,
      borderBottomColor: palette.error,
    },
  },
  input: {
    borderRadius: 0,
    boxShadow: 'none',
    color: palette.mediumGrey,
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    padding: '1.25rem 0',
    paddingBottom: '5px',
    '&::placeholder': {
      color: palette.mediumGrey,
      fontWeight: 'normal',
    },
    '&:focus': {
      backgroundColor: 'transparent',
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
  },
  inputMultiple: {
    borderRadius: 0,
    boxShadow: 'none',
    color: palette.mediumGrey,
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    padding: '1.25rem 0',
    paddingBottom: '0px',
    '&::placeholder': {
      color: palette.mediumGrey,
      fontWeight: 'normal',
    },
    '&:focus': {
      backgroundColor: 'transparent',
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
  },
};

export default styles;
