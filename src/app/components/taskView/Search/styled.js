import React from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const ClearButton = styled.div`
  align-items: center;
  display: inline-flex;
  cursor: pointer;

  > img {
    height: 15px;
    max-height: 15px;
    max-width: 15px;
    min-height: 15px;
    min-width: 15px;
    width: 15px;
  }
`;

export const StyledTextField = styled(TextField)`
  && {
    ${props => !props.noBackground && `background-color: ${palette.white};`}
    border-radius: 0.25rem;
    color: ${palette.coolGrey1};
    height: 2.5rem;
    ${props => props.fullWidth && 'width: 100%;'}

    & .MuiInputBase-root {
      border: 0.0625rem solid
        ${props =>
          props.variant === 'outlined'
            ? palette.coolGrey3
            : opacify(palette.coolGrey3, 0)};
      border-radius: 0;
      height: 100%;
      padding: 0 0.25rem 0 0.5rem;
      transition: all 0.25s ease-in-out;
      width: ${props => (props.fullWidth ? '100%' : '8rem')};

      &::after,
      &::before {
        border: 0 !important;
      }
    }

    & .MuiInputBase-root.Mui-focused {
      border: 0.0625rem solid ${palette.coolGrey3};
      width: ${props => (props.fullWidth ? '100%' : '16.8125rem')};
    }

    & input {
      caret-color: ${palette.coolGrey1};
      color: ${palette.coolGrey1};
      height: 100%;
      border: none;
      box-shadow: none;
      background: none;
      font-size: 0.875rem;
      padding: 0;

      &::placeholder {
        color: ${palette.coolGrey1};
        font-size: 1rem;
        opacity: 0.8;
        text-transform: uppercase;
      }
    }

    & fieldset {
      border: none;
      top: 0;
    }
  }
`;

export const StyledAdornment = withStyles({
  root: {
    height: '1.125rem',
    minHeight: '1.125rem',
    minWidth: '1.125rem',
    width: '1.125rem',
  },
  positionEnd: {
    margin: '0 0.25rem',
  },
  visible: {
    visibility: 'initial',
  },
  invisible: {
    visibility: 'hidden',
  },
})(({ position, visible = true, classes, ...props }) => {
  const className = clsx(
    classes.root,
    position === 'end' && classes.positionEnd,
    visible ? classes.visible : classes.invisible,
  );

  return (
    <InputAdornment className={className} position={position} {...props} />
  );
});
