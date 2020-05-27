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
    marginBottom: props => (props.parentType === 'text' ? '7px' : '0px'),
    boxShadow: 'none',
    '& label': {
      color: palette.coolGrey2,
    },
    '& label.Mui-focused': {
      color: palette.coolGrey2,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: palette.coolGrey2,
    },
    '& .MuiInput-input': {
      boxShadow: 'none',
    },
    '& label + .MuiInput-formControl': {
      marginTop: props => (props.parentType === 'text' ? '2px' : '16px'),
    },
    '& .MuiInputBase-inputMultiline': {
      height: '24px',
      minHeight: '24px',
    },
    '& .MuiInputBase-multiline': {
      paddingTop: props => (props.parentType === 'text' ? '12px' : '0px'),
      paddingBottom: '0px',
    },
    '& .MuiInputBase-root': {
      flexWrap: props => (props.parentType === 'selectTag' ? 'wrap' : ''),
      paddingRight: props =>
        props.parentType === 'selectTag' ? '30px' : '0px',
    },
  },
  error: {
    border: BORDER,
    borderBottomColor: palette.error,
  },
  errorMessage: {
    color: palette.error,
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
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
    padding: props =>
      props.parentType === 'text' && !props.multiple
        ? '1.25rem 0'
        : '0.75rem 0',
    paddingBottom: props => (props.multiple ? '0px' : '5px'),
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
