import {
  ButtonBase,
  FormControl,
  FormHelperText,
  InputBase,
  InputLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';

export const StyledFormControl = withStyles({
  root: {
    backgroundColor: '#f3f5f6',
    height: '4rem',
  },
})(FormControl);

export const StyledInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1rem, -50%) scale(1)',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
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
    transform: 'translate(1rem, 0) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: '#ababb2 !important',
  },
})(InputLabel);

export const StyledInputBase = withStyles({
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
    padding: '0.5rem 1rem',
    '&[disabled]': {
      backgroundColor: '#f3f5f6',
    },
    '&:focus': {
      backgroundColor: '#f3f5f6',
      border: 0,
      boxShadow: 'none',
    },
  },
})(InputBase);

export const BillingElementContainer = styled.div`
  align-items: center;
  border-color: ${props => (props.error ? '#e40909' : '#e4090900')};
  border-style: solid;
  border-width: 0.0625rem;
  display: flex;
  cursor: text;
  height: 4rem;
  justify-content: flex-start;
  padding: 0.5rem 1rem;
  padding-bottom: 0;
  transition: all 0.25s ease-out;
  width: 100%;

  > * {
    height: 1.0625rem;
    width: 100%;
  }
`;

export const BillingButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    height: '3rem',
    padding: '0.25rem 0.5rem',
  },
  contained: {
    backgroundColor: '#074a86',
    color: '#fff',
  },
  outlined: {
    color: '#074a86',
    height: '2rem',
  },
  outlinedHigh: {
    color: '#074a86',
  },
  fullWidth: {
    width: '100%',
  },
})(({ classes, variant, fullWidth, ...props }) => {
  const className = `${classes.root} ${classes[variant]} ${
    fullWidth ? classes.fullWidth : ''
  }`.trim();

  return <ButtonBase className={className} {...props} />;
});

export const StyledFormHelperText = withStyles({
  root: {
    color: '#e40909',
    fontSize: '0.75rem',
  },
})(FormHelperText);
