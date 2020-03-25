import {
  Collapse,
  FormControl,
  InputBase,
  InputLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';

export const ErrorLabel = styled.h4`
  color: #e40909;
  font-size: 0.75rem;
  margin: 0;
  margin-bottom: 0.125rem;
  user-select: none;
`;

export const UniversalFormControl = withStyles({
  root: {
    backgroundColor: '#f9fafc',
    height: '4rem',
    transition: 'all 0.2s ease-out',
  },
  whiteBackground: {
    backgroundColor: '#fff',
  },
  error: {
    backgroundColor: '#f3f5f6',
  },
})(({ classes, whiteBackground, error, ...props }) => {
  const className = clsx(
    classes.root,
    error && classes.error,
    whiteBackground && classes.whiteBackground,
  );
  return <FormControl className={className} {...props} />;
});

export const UniversalInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1rem, -50%) scale(1)',
    transition: 'all 200ms ease',
    zIndex: 2,
  },
  required: {
    '& > span': {
      color: '#f00',
    },
  },
  shrink: {
    color: '#ababb2',
    top: '5%',
    transform: 'translate(1rem, 0.375rem) scale(1)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
  },
  focused: {
    color: '#ababb2 !important',
  },
})(InputLabel);

export const UniversalInputBase = withStyles({
  root: {
    border: '0.0625rem solid #dedee200',
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  error: {
    border: '0.0625rem solid #e40909',
  },
  focused: {
    border: '0.0625rem solid #dedee2',
    '&$error': {
      border: '0.0625rem solid #e40909',
    },
  },
  input: {
    borderRadius: 0,
    boxShadow: 'none',
    fontFamily: '"Open Sans", sans-serif',
    paddingBottom: 0,
    padding: '1.25rem 1rem',
    '&:focus': {
      backgroundColor: '#f3f5f600',
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: '#f3f5f600',
      cursor: 'pointer',
    },
  },
})(InputBase);

export const UniversalMobileInputComponent = ({ inputRef, ...otherProps }) => (
  <MaskedInput
    {...otherProps}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[
      '(',
      /[1-9]/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]}
    guide
  />
);

export const UniversalBirthdayInputComponent = ({
  inputRef,
  ...otherProps
}) => (
  <MaskedInput
    {...otherProps}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
    guide
  />
);

export const UniversalInput = ({
  label,
  name,
  placeholder,
  inputContainerReference = undefined,
  CustomComponent = undefined,
  required = false,
  className = '',
  whiteBackground = false,
  customShrinkCondition = undefined,
  ...InputBaseProps
}) => {
  const { register, errors, clearError, watch } = useFormContext();
  const error = errors?.[name]?.message;

  const hasError = Boolean(error);

  const [focused, setFocused, unsetFocused] = useBoolean(false);

  const value = watch(name);

  const shrink =
    typeof customShrinkCondition === 'undefined'
      ? Boolean(focused || value || placeholder)
      : Boolean(customShrinkCondition);

  return (
    <div ref={inputContainerReference} className={className}>
      <Collapse in={hasError} timeout={150}>
        <ErrorLabel>{error}</ErrorLabel>
      </Collapse>
      <UniversalFormControl
        error={hasError}
        whiteBackground={whiteBackground}
        fullWidth
      >
        <UniversalInputLabel required={required} shrink={shrink}>
          {label}
        </UniversalInputLabel>
        <UniversalInputBase
          name={name}
          placeholder={placeholder}
          inputRef={register}
          error={hasError}
          inputComponent={CustomComponent}
          onKeyUp={() => clearError(name)}
          onFocus={setFocused}
          onBlur={unsetFocused}
          {...InputBaseProps}
        />
      </UniversalFormControl>
    </div>
  );
};
