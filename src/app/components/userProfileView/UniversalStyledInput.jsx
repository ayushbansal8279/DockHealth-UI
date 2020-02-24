import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

export const ErrorLabel = styled.h4`
  color: #e40909;
  font-size: 0.75rem;
  margin: 0.5rem 0 0;
  user-select: none;
`;

export const UniversalFormControl = withStyles({
  root: {
    backgroundColor: '#f3f5f6',
    height: '4rem',
  },
})(FormControl);

export const UniversalInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1.5rem, -50%) scale(1)',
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
    transform: 'translate(1.5rem, 0) scale(0.65)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
  },
  focused: {
    color: '#ababb2 !important',
  },
})(InputLabel);

export const UniversalInputBase = withStyles({
  root: {
    border: '0.0625rem solid #e4090900',
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  error: {
    border: '0.0625rem solid #e40909',
  },
  input: {
    borderRadius: '0.25rem',
    boxShadow: 'none',
    fontFamily: '"Open Sans", sans-serif',
    paddingBottom: 0,
    padding: '0.6rem 1.5rem',
    '&:focus': {
      backgroundColor: '#f3f5f6',
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: '#f3f5f6',
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

export const UniversalStyledInput = ({
  label,
  name,
  placeholder,
  inputContainerReference = undefined,
  CustomComponent = undefined,
  required = false,
  className = '',
  ...InputBaseProps
}) => {
  const { register, errors } = useFormContext();
  const error = errors?.[name]?.message;

  return (
    <div ref={inputContainerReference} className={className}>
      <UniversalFormControl fullWidth>
        <UniversalInputLabel required={required}>{label}</UniversalInputLabel>
        <UniversalInputBase
          name={name}
          placeholder={placeholder}
          inputRef={register}
          error={Boolean(error)}
          inputComponent={CustomComponent}
          {...InputBaseProps}
        />
      </UniversalFormControl>
      <Collapse in={error} timeout={150}>
        <ErrorLabel>{error}</ErrorLabel>
      </Collapse>
    </div>
  );
};
