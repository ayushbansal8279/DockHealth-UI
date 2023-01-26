import {
  ButtonBase,
  FormControl,
  InputBase,
  InputLabel,
  Grid,
} from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const StyledFormControl = styled(FormControl)`
  &&& {
    .MuiFormControl-root {
      background-color: ${palette.lightGrey};
      height: 4rem;
    }
  }
`;

export const StyledInputLabel = styled(InputLabel)`
  &&& {
    .MuiInputLabel-root {
      color: ${palette.greyBlue};
      pointer-events: none;
      top: 50%;
      transform: translate(1rem, -50%) scale(1);
      transition: all 200ms cubic-bezier(0, 0, 0.2, 1);
      z-index: 2;
    }

    .Mui-required {
      & > span {
        color: ${palette.error};
      }
    }

    .MuiInputLabel-shrink {
      color: ${palette.unknownGrey5};
      top: 5%;
      transform: translate(1rem, 0) scale(0.75);
      transform-origin: center left;
      transition: all 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    .Mui-focused {
      color: ${palette.unknownGrey5} !important;
    }
  }
`;

export const StyledInputBase = styled(InputBase)`
  &&& {
    .MuiInputBase-root {
      border: 0.0625rem solid ${opacify(palette.error, 0)};
      height: 100%;
      transition: all 0.2s ease-out;
      z-index: 1;
    }

    .Mui-error {
      border: 0.0625rem solid ${palette.error};
    }

    .MuiInputBase-input {
      border-radius: 0.25rem;
      box-shadow: none;
      font-family: 'Open Sans', sans-serif;
      padding-bottom: 0;
      padding: 0.5rem 1rem;

      &:focus {
        background-color: ${palette.lightGrey};
        border: 0;
        box-shadow: none;
      }

      &[disabled] {
        background-color: ${palette.lightGrey};
      }
    }
  }
`;

const InnerBillingButton = ({ classes, variant, fullWidth, ...props }) => {
  const className = `${classes.root} ${classes[variant]} ${
    fullWidth ? classes.fullWidth : ''
  }`.trim();

  return <ButtonBase className={className} {...props} />;
};

export const BillingButton = styled(InnerBillingButton)`
  &&& {
    .MuiButtonBase-root {
      border-radius: 0.25rem;
      height: 3rem;
      padding: 0.25rem 0.5rem;
    }

    .MuiButtonBase-contained {
      background-color: ${palette.darkBlue};
      color: ${palette.white};
    }

    .MuiButtonBase-outlined {
      color: ${palette.darkBlue};
      height: 2rem;
    }

    .MuiButtonBase-outlinedHigh {
      color: ${palette.darkBlue};
    }

    .MuiButtonBase-fullWidth {
      width: 100%;
    }
  }
`;

export const FormContainer = styled(Grid)`
  && {
    display: ${(props) => (props.visible ? 'flex' : 'none')};
  }
`;

export const AddressLineToggleContainer = styled.div`
  color: ${palette.midnightBlue};
  cursor: pointer;
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
