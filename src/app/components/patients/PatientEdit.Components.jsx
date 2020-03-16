import { Collapse } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

export const StyledFormControl = withStyles({
  root: {
    backgroundColor: 'rgba(243, 245, 246, 0.5)',
    border: '0.0625rem solid #e4090900',
    height: '3.5rem',
    margin: '0.125rem 0',
    transition: 'all 0.25s ease-out',
  },
  error: {
    border: '0.0625rem solid #e40909',
  },
})(({ error, classes, ...props }) => {
  const className = `${classes.root} ${error ? classes.error : ''}`.trim();

  return <FormControl className={className} error={error} {...props} />;
});

export const StyledSelectComponent = withStyles({
  select: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'inline-flex',
    width: '100%',
  },
})(Select);

export const StyledInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    top: '50%',
    transform: 'translate(0.5rem, -50%) scale(1)',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  required: {
    '& > span': {
      color: '#f00',
    },
  },
  shrink: {
    color: '#2e3a43',
    top: '0%',
    transform: 'translate(0.5rem, 0.25rem) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: '#2e3a43 !important',
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    height: '3.5rem',
    margin: 'auto 0',
  },
  input: {
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: '0.25rem',
    boxShadow: 'none',
    height: '3.5rem',
    paddingBottom: 0,
    padding: '0.25rem 0.5rem',
    '&:focus': {
      backgroundColor: 'transparent',
      border: 0,
      boxShadow: 'none',
    },
    '&[disabled]': {
      backgroundColor: 'transparent',
      cursor: 'default',
    },
  },
  error: {
    color: '#e40909',
  },
})(InputBase);

export const PanelActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0.5rem 0;
`;

export const ButtonPaddingContainer = styled.div`
  margin-right: 0.5rem;
`;

const StyledCollapse = styled(Collapse)`
  && {
    width: 100%;
  }
`;

const ErrorLabel = styled.div`
  color: #e40909;
  font-size: 0.75rem;
`;

export const BirthdayTextMask = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
    placeholderChar={'\u2000'}
    keepCharPositions
  />
);

export const PhoneNumberTextMask = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]}
    placeholderChar={'\u2000'}
    keepCharPositions
  />
);

export const StyledTextField = ({
  name,
  label,
  error,
  required = false,
  value,
  onChange,
  InputProps,
  children,
}) => {
  const hasError = Boolean(error);

  return (
    <>
      <StyledFormControl fullWidth required={required} error={hasError}>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledInputBase
          name={name}
          value={value}
          onChange={onChange}
          error={hasError}
          autoComplete={uuid()}
          {...InputProps}
        >
          {children}
        </StyledInputBase>
      </StyledFormControl>
      <StyledCollapse in={hasError} timeout={150}>
        <ErrorLabel>{error}</ErrorLabel>
      </StyledCollapse>
    </>
  );
};

export const StyledSelect = ({
  name,
  label,
  error,
  required = false,
  value,
  onChange,
  children,
}) => {
  const hasError = Boolean(error);

  return (
    <>
      <StyledFormControl fullWidth required={required} error={hasError}>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledSelectComponent
          value={value}
          onChange={onChange}
          input={<StyledInputBase name={name} error={hasError} />}
          autoComplete={uuid()}
        >
          {children}
        </StyledSelectComponent>
      </StyledFormControl>
      <StyledCollapse in={hasError} timeout={150}>
        <ErrorLabel>{error}</ErrorLabel>
      </StyledCollapse>
    </>
  );
};
