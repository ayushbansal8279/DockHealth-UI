import { FormControl, InputBase, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { any, bool, func, objectOf, string } from 'prop-types';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';

const DrawerFormControl = withStyles({
  root: {
    backgroundColor: 'transparent',
    height: '4rem',
    transition: 'all 0.2s ease-out',
  },
  error: {
    backgroundColor: 'transparent',
  },
})(({ classes, error, ...props }) => {
  const className = clsx(classes.root, error && classes.error);
  return <FormControl className={className} {...props} />;
});

const FONT_FAMILY = '"Roboto Condensed", sans-serif';
const BORDER = '0.0625rem solid transparent';

const DrawerInputLabel = withStyles({
  root: {
    color: palette.coolGrey2,
    fontFamily: FONT_FAMILY,
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(0, -50%) scale(1)',
    transition: 'all 200ms ease',
    zIndex: 2,
  },
  required: {
    '& > span': {
      color: palette.error,
    },
  },
  shrink: {
    color: palette.coolGrey2,
    top: '5%',
    transform: 'translate(0, 0.375rem) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
  },
  focused: {
    color: `${palette.coolGrey2} !important`,
  },
})(InputLabel);

const DrawerInputBase = withStyles({
  root: {
    border: BORDER,
    borderBottomColor: palette.coolGrey2,
    borderRadius: 0,
    fontFamily: FONT_FAMILY,
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
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
    paddingBottom: 0,
    padding: '1.25rem 0',
    '&::placeholder': {
      color: palette.coolGrey1,
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
})(InputBase);

const DrawerInputContainer = styled.div`
  width: 100%;
`;

const TextInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      name,
      required,
      className,
      onFocus,
      onBlur,
      InputLabelProps,
      inputProps,
      InputProps,
      select,
      ...props
    },
    reference,
  ) => {
    const { register, watch } = useFormContext();

    const value = watch(name);
    const isStartAdornmentShown = !value;

    const { startAdornment = null, ...otherInputProps } = InputProps;

    return (
      <DrawerInputContainer ref={reference} className={className} {...props}>
        <DrawerFormControl fullWidth>
          <DrawerInputLabel {...InputLabelProps}>
            <span>{label?.toUpperCase()}</span>
            {required && (
              <>
                <Spacing horizontal={3} />
                <span>(required)</span>
              </>
            )}
          </DrawerInputLabel>
          <DrawerInputBase
            {...otherInputProps}
            startAdornment={isStartAdornmentShown && startAdornment}
            name={name}
            placeholder={placeholder}
            inputRef={select ? null : register}
            onFocus={onFocus}
            onBlur={onBlur}
            inputProps={inputProps}
          />
        </DrawerFormControl>
      </DrawerInputContainer>
    );
  },
);

TextInput.propTypes = {
  label: string.isRequired,
  placeholder: string,
  name: string.isRequired,
  className: string,
  required: bool,
  onFocus: func,
  onBlur: func,
  select: bool,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
  InputLabelProps: objectOf(any),
};

TextInput.defaultProps = {
  placeholder: '',
  className: '',
  required: false,
  select: false,
  onFocus: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default TextInput;
