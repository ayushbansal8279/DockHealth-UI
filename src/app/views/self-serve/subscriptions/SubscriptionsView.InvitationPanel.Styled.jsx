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

export const InvitationPanelContainer = styled.div`
  background-color: ${props => (props.open ? '#fff' : '#fff0')};
  box-shadow: ${props =>
    props.open ? '0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25)' : 'none'};
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
  color: #074a86;
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
  color: #ababb2;
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
  color: #e40909;
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
    transform: 'translate(0.5rem, 0) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: '#2e3a43 !important',
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    height: '2.625rem',
  },
  input: {
    backgroundColor: '#f3f5f6',
    borderRadius: '0.25rem',
    boxShadow: 'none',
    boxSizing: 'border-box',
    paddingBottom: 0,
    padding: '0.6rem 0.5rem',
    height: '100%',
    '&:focus': {
      backgroundColor: '#f3f5f6',
      border: 0,
      boxShadow: 'none',
    },
  },
  error: {
    borderRadius: '0.25rem',
    border: '0.0625rem solid #e40909',
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
    color: '#074a86',
  },
  contained: {
    backgroundColor: '#074a86',
    color: '#fff',
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
