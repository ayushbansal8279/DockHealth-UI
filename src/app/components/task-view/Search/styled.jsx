import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';
import { fontWeights } from 'styles/font';

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
    ${(props) =>
      props.transparentbackground === 'false' &&
      `background-color: ${palette.white};`}
    border-radius: 0.25rem;
    color: ${palette.coolGrey1};
    height: ${({ isWorkFlowSearch }) => (isWorkFlowSearch ? '48px' : '2.5rem')};
    ${(props) => (props.fullWidth ? 'width: 100%;' : '')}

    & .MuiInputBase-root {
      border: 0.0625rem solid
        ${(props) =>
          props.variant === 'outlined'
            ? palette.coolGrey3
            : opacify(palette.coolGrey3, 0)};
      border-radius: 0;
      height: 100%;
      padding: 0 0.25rem 0 0.5rem;
      transition: all 0.25s ease-in-out;
      width: ${(props) => (props.fullWidth ? '100%' : '9rem')};

      &::after,
      &::before {
        border: 0 !important;
      }
    }

    & .MuiInputBase-root.Mui-focused {
      border: ${({ isWorkFlowSearch }) =>
        isWorkFlowSearch ? '' : `0.0625rem solid ${palette.coolGrey3}`};
      width: ${(props) => (props.fullWidth ? '100%' : '16.8125rem')};
    }

    & input {
      caret-color: ${palette.coolGrey1};
      color: ${palette.coolGrey1};
      font-family: 'Outfit', sans-serif;
      height: 100%;
      border: none;
      box-shadow: none;
      background: none;
      font-size: 0.875rem;
      font-weight: ${fontWeights.regular};
      padding: 0;

      &::placeholder {
        font-family: ${({ isWorkFlowSearch }) =>
          isWorkFlowSearch ? 'Outfit' : ''};
        color: ${({ isWorkFlowSearch }) =>
          isWorkFlowSearch ? palette.lightGrayishBlue : palette.coolGrey1};
        font-size: ${({ isWorkFlowSearch }) =>
          isWorkFlowSearch ? '14px' : '1rem'};
        font-weight: ${({ isWorkFlowSearch }) =>
          isWorkFlowSearch ? fontWeights.light : fontWeights.regular};
        opacity: 0.8;
        text-transform: ${({ isWorkFlowSearch }) =>
          isWorkFlowSearch ? 'none' : 'uppercase'};
        line-height: ${({ isWorkFlowSearch }) =>
          isWorkFlowSearch ? '18.9px' : ''};
      }
    }

    & fieldset {
      border: none;
      top: 0;
    }
  }
`;

const InnerAdornment = ({ position, visible = true, classes, ...props }) => {
  const className = clsx(
    classes?.root,
    position === 'end' && classes?.positionEnd,
    visible ? classes?.visible : classes?.invisible,
  );

  return (
    <InputAdornment className={className} position={position} {...props} />
  );
};

export const StyledAdornment = styled(InnerAdornment)`
  &&& {
    &.MuiInputAdornment-root {
      height: 1.125rem;
      min-height: 1.125rem;
      min-width: 1.125rem;
      width: 1.125rem;
    }

    &.MuiInputAdornment-positionEnd {
      margin: 0 0.25rem;
    }

    &.MuiInputAdornment-visible {
      display: block;
    }

    &.MuiInputAdornment-invisible {
      display: none;
    }
  }
`;
