import {
  ButtonBase,
  FormControl,
  FormHelperText,
  InputBase,
  InputLabel,
  Grid,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';
import palette, { opacify } from '../../../palette';

export const StyledFormControl = withStyles({
  root: {
    backgroundColor: palette.lightGrey,
    height: '4rem',
  },
})(FormControl);

export const StyledInputLabel = withStyles({
  root: {
    color: palette.greyBlue,
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1rem, -50%) scale(1)',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
    zIndex: 2,
  },
  required: {
    '& > span': {
      color: palette.error,
    },
  },
  shrink: {
    color: palette.unknownGrey5,
    top: '5%',
    transform: 'translate(1rem, 0) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: `${palette.unknownGrey5} !important`,
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    border: `0.0625rem solid ${opacify(palette.error, 0)}`,
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  error: {
    border: `0.0625rem solid ${palette.error}`,
  },
  input: {
    borderRadius: '0.25rem',
    boxShadow: 'none',
    fontFamily: '"Open Sans", sans-serif',
    paddingBottom: 0,
    padding: '0.5rem 1rem',
    '&[disabled]': {
      backgroundColor: palette.lightGrey,
    },
    '&:focus': {
      backgroundColor: palette.lightGrey,
      border: 0,
      boxShadow: 'none',
    },
  },
})(InputBase);

export const BillingElementContainer = styled.div`
  align-items: center;
  border-color: ${props =>
    props.error ? palette.error : opacify(palette.error, 0)};
  border-style: solid;
  border-width: 0.0625rem;
  display: flex;
  cursor: text;
  height: 4rem;
  justify-content: flex-start;
  padding: 1rem;
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
    backgroundColor: palette.darkBlue,
    color: palette.white,
  },
  outlined: {
    color: palette.darkBlue,
    height: '2rem',
  },
  outlinedHigh: {
    color: palette.darkBlue,
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
    color: palette.error,
    fontSize: '0.75rem',
  },
})(FormHelperText);

export const FormContainer = styled(Grid)`
  && {
    display: ${props => (props.visible ? 'flex' : 'none')};
  }
`;

export const AddressLineToggleContainer = styled.div`
  color: ${palette.midnightBlue};
  cursor: pointer;
`;

export const CardNumberElementContainer = styled.div`
  position: relative;
`;

export const AcceptedCardsContainer = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 0.25rem;
  grid-template-columns: repeat(4, auto);
  height: 50%;
  position: absolute;
  right: 0.5rem;
  top: 25%;

  > img {
    background-color: ${palette.white};
    border-radius: 0.25rem;
    border: 0.5px solid ${opacify(palette.black, 0.2)};
    cursor: default;
    object-fit: contain;
    width: 2.5rem;
  }
`;
