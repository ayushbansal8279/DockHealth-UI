import { FormControl, InputBase, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

import palette from 'styles/palette';

const FONT_FAMILY = '"Roboto Condensed", sans-serif';
const BORDER = '0.0625rem solid transparent';
const MIN_INPUT_HEIGHT = '4rem';
const ANIMATION = 'all 0.2s ease-out';

export const DrawerFormControl = withStyles({
  root: {
    backgroundColor: 'transparent',
    height: MIN_INPUT_HEIGHT,
    transition: ANIMATION,
  },
  error: {
    backgroundColor: 'transparent',
  },
  multiple: {
    height: 'unset',
    minHeight: MIN_INPUT_HEIGHT,
  },
})(({ classes, error, multiple, ...props }) => {
  const className = clsx(
    classes.root,
    error && classes.error,
    multiple && classes.multiple,
  );

  return <FormControl className={className} {...props} />;
});

export const DrawerInputLabel = withStyles({
  root: {
    color: palette.coolGrey2,
    fontFamily: FONT_FAMILY,
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(0, -50%) scale(1)',
    transition: ANIMATION,
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
    transition: ANIMATION,
  },
  focused: {
    color: `${palette.coolGrey2} !important`,
  },
})(InputLabel);

export const DrawerInputBase = withStyles({
  root: {
    border: BORDER,
    borderBottomColor: palette.coolGrey2,
    borderRadius: 0,
    fontFamily: FONT_FAMILY,
    height: '100%',
    transition: ANIMATION,
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

export const DrawerInputBaseMultiple = withStyles({
  root: {
    border: BORDER,
    borderBottomColor: palette.coolGrey2,
    borderRadius: 0,
    fontFamily: FONT_FAMILY,
    height: '100%',
    paddingTop: '2rem',
    transition: ANIMATION,
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
    padding: '1.50rem 0',
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

export const DrawerInputContainer = styled.div`
  width: 100%;

  & input {
    ${props => props.multiple && 'margin-bottom: 0.5rem; padding-top: 0;'}
  }
`;
