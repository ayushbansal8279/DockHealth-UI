import palette from 'styles/palette';

const FONT_FAMILY = '"Roboto Condensed", sans-serif';
const BORDER = '0.0625rem solid transparent';
const ANIMATION = 'all 0.2s ease-out';

const styles = {
  root: {
    border: BORDER,
    borderRadius: 0,
    fontFamily: FONT_FAMILY,
    height: '100%',
    transition: ANIMATION,
    zIndex: 1,
    boxShadow: 'none',
    borderBottomColor: props =>
      props.disabled ? palette.coolGrey2 : palette.coolGrey1,
    '& label': {
      color: palette.coolGrey1,
    },
    '& label.Mui-disabled': {
      color: palette.coolGrey2,
    },
    '& label.Mui-focused': {
      color: palette.coolGrey1,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: palette.coolGrey1,
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
      paddingBottom: props => (props.parentType === 'text' ? '5px' : '0px'),
    },
    '& .MuiInputBase-root': {
      flexWrap: props => (props.parentType === 'selectTag' ? 'wrap' : ''),
      paddingRight: props =>
        props.parentType === 'selectTag' ? '30px' : '0px',
    },
  },
  label: {
    color: palette.oPlusRed,
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
    borderBottomColor: palette.coolGrey1,
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
      opacity: 1,
      color: palette.coolGrey1,
      fontWeight: 'normal',
    },
    '&:focus': {
      backgroundColor: 'transparent',
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly]': {
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '&[disabled]': {
      backgroundColor: 'transparent',
      cursor: 'initial',

      '&::placeholder': {
        color: palette.coolGrey2,
      },
    },
  },
};

export default styles;
