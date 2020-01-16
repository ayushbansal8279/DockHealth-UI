import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import styled from 'styled-components';
import { ButtonBase } from '@material-ui/core';
import React from 'react';

export const StyledFormControl = withStyles({
  root: {
    backgroundColor: '#f3f5f6',
    height: '3rem',
    marginBottom: '0.5rem',
  },
})(FormControl);

export const StyledInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(0.5rem, -50%) scale(1)',
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
    transform: 'translate(0.5rem, 0) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: '#ababb2 !important',
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    height: '100%',
    zIndex: 1,
  },
  input: {
    borderRadius: '0.25rem',
    boxShadow: 'none',
    fontFamily: '"Open Sans", sans-serif',
    paddingBottom: 0,
    padding: '0.6rem 0.5rem',
    '&:focus': {
      backgroundColor: '#f3f5f6',
      border: 0,
      boxShadow: 'none',
    },
  },
})(InputBase);

export const BillingElementContainer = styled.div`
  align-items: center;
  display: flex;
  cursor: text;
  height: 4rem;
  padding: 0.5rem;
  padding-bottom: 0;
  justify-content: flex-start;
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
    width: '100%',
  },
  contained: {
    backgroundColor: '#074a86',
    color: '#fff',
  },
  outlined: {
    color: '#074a86',
  },
})(({ classes, variant, ...props }) => {
  const className = `${classes.root} ${classes[variant]}`.trim();

  return <ButtonBase className={className} {...props} />;
});
