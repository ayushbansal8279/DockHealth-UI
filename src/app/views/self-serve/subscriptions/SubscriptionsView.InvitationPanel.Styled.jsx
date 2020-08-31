import {
  ButtonBase,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const InvitationPanelContainer = styled.div`
  background-color: ${props =>
    props.open ? palette.white : opacify(palette.white, 0)};
  box-shadow: ${props =>
    props.open
      ? `0px 0.25rem 0.25rem ${opacify(palette.black, 0.25)}`
      : 'none'};
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  transition: all 0.25s ease-out;
  width: 100%;
  z-index: 1;
`;

export const InvitationPanelHeader = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 0.125rem;
`;

export const AddMoreUsersLabel = styled.div`
  align-items: center;
  display: flex;
  color: ${palette.darkBlue};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.375rem 0.625rem;
  transition: all 0.25s ease-out;

  &:hover {
    filter: brightness(1.25);
  }
`;

export const CloseButtonContainer = styled.div`
  align-items: center;
  color: ${palette.unknownGrey5};
  cursor: ${props => (props.open ? 'pointer' : 'default')};
  display: flex;
  font-size: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  opacity: ${props => (props.open ? 1 : 0)};
  transition: all 0.25s ease-out;
  width: 1.5rem;
`;

export const InputErrorLabel = styled.div`
  color: ${palette.error};
  font-size: 0.75rem;
  height: 1rem;
  margin-bottom: 0.1875rem;
  min-height: 1rem;
`;

export const StyledFormControl = withStyles({
  root: {
    height: '2.625rem !important',
    marginBottom: '0.5rem',
  },
})(FormControl);

export const StyledInputLabel = withStyles({
  root: {
    color: palette.greyBlue,
    top: '50%',
    transform: 'translate(0.5rem, -50%) scale(1)',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  required: {
    '& > span': {
      color: palette.error,
    },
  },
  shrink: {
    color: palette.greyBlue,
    top: '0%',
    transform: 'translate(0.5rem, 0) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: `${palette.greyBlue} !important`,
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    height: '2.625rem',
  },
  input: {
    borderBottom: 'inset',
    backgroundColor: 'transparent',
    borderRadius: '0.25rem',
    boxShadow: 'none',
    boxSizing: 'border-box',
    paddingBottom: 0,
    padding: '0.6rem 0.5rem',
    height: '100%',
    '&:focus': {
      backgroundColor: 'transparent',
      border: 1,
      boxShadow: 'none',
    },
  },
  error: {
    borderRadius: '0.25rem',
    border: `0.0625rem solid ${palette.error}`,
  },
})(InputBase);

export const StyledButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    height: '2.5rem',
    marginLeft: '0.75rem',
    width: '9.5rem',
  },
  text: {
    color: palette.darkBlue,
  },
  contained: {
    backgroundColor: palette.darkBlue,
    color: palette.white,
  },
})(({ classes, variant, ...props }) => {
  const variantClassName = classes[variant] || '';
  const rootClassName = classes.root || '';

  const className = `${rootClassName} ${variantClassName}`.trim();

  return <ButtonBase className={className} {...props} />;
});

export const PanelButtonContainer = styled(Grid)`
  && {
    margin-top: 0.75rem;
  }
`;
