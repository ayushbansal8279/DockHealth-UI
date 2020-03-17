import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import styled from 'styled-components';
import SearchIconImage from '../img/search-dark.svg';

export const FormContainer = styled.form`
  align-items: flex-start;
  background-color: #fff;
  flex-basis: auto;
  flex-flow: column wrap;
  display: flex;
  padding: 2rem 2.5rem;
  width: 100%;

  & > * {
    margin: 0.25rem 0;
  }
`;

export const FormLabel = styled.h1`
  font-size: 1.25rem;
  margin: 0;
`;

export const FormDivider = styled.hr`
  && {
    border-bottom: 0.125rem solid #dedee2;
    margin: 1rem 0;
    width: 100%;
  }
`;

export const StyledFormControl = withStyles({
  root: {
    backgroundColor: '#f3f5f6',
    height: '4.5rem',
    margin: '1rem 0 0',
  },
})(FormControl);

export const StyledInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    top: '50%',
    transform: 'translate(1rem, -50%) scale(1)',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
    width: '50%',
  },
  required: {
    '& > span': {
      color: '#f00',
    },
  },
  shrink: {
    color: '#2e3a43',
    top: '0%',
    transform: 'translate(1rem, 0.5rem) scale(0.75)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: '#2e3a43 !important',
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    height: '4rem',
    margin: 'auto 0',
  },
  input: {
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: '0.25rem',
    boxShadow: 'none',
    height: '4rem',
    paddingBottom: 0,
    padding: '0.5rem 1rem',
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
})(InputBase);

export const MemberContainer = styled.div`
  height: 55px;
  width: 55px;
`;

export const MembersContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row-reverse nowrap;
  margin: 0 0.5rem;
  justify-content: flex-start;

  > ${MemberContainer}:not(:first-child) {
    width: 41px;
  }
`;

export const EmptyMember = styled(ButtonBase)`
  && {
    background-color: #fff;
    border: 0.0625rem dashed #0ca1c7;
    border-radius: 50%;
    color: #0ca1c7;
    font-size: 2rem;
    height: 100%;
    width: 55px;
  }
`;

export const EmptyMemberIcon = styled.div`
  transform: rotate(${props => (props.rotated ? -45 : 0)}deg);
  transition: all 0.25s ease-out;
`;

export const InputFieldSpacer = styled.div`
  min-height: 1rem;
  height: 1rem;
  width: 100%;
`;

export const StyledCollapse = styled(Collapse)`
  && {
    margin: 0;
    width: 100%;
  }
`;

export const StyledListItem = styled(ListItem)`
  && {
    background-color: #f3f5f6;
    height: 4rem;
    width: 100%;
  }
`;

export const StyledList = styled(List)`
  && {
    margin: 0;
    max-height: 12rem;
    overflow-y: auto;
    padding: 0;
    width: 100%;

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      background-color: #cecece;
      padding: 1px;
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
      z-index: 100;
    }
  }
`;

export const StyledButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    fontSize: '1rem',
    height: '2.5rem',
    marginLeft: '1rem',
  },
  outlined: {
    color: '#009fcd',
    minWidth: '5rem',
  },
  contained: {
    backgroundColor: '#007cab',
    color: '#fff',
    fontWeight: 'bold',
    minWidth: '10rem',
  },
})(({ classes, variant, disabled, ...props }) => {
  const className = `${classes.root} ${classes[variant] ?? ''} ${classes[
    `${variant}Disabled`
  ] ?? ''}`.trim();

  return <ButtonBase className={className} disabled={disabled} {...props} />;
});

export const CloseButton = withStyles({
  root: {
    backgroundColor: '#d9036b',
    borderRadius: '1.25rem',
    color: '#fff',
    fontSize: '2rem',
    height: '2.5rem',
    width: '2.5rem',
  },
})(ButtonBase);

export const FormSpacing = styled.div`
  height: 2rem;
  width: 100%;
`;

export const FormDoubleSpacing = styled(FormSpacing)`
  height: 3rem;
`;

export const SearchFieldContainer = styled.div`
  height: 2.5rem;
  position: relative;
  width: 100%;
`;

export const SearchField = styled.input`
  background-color: #fff;
  border: 0;
  color: #000;
  height: 100%;
  padding: 0.5rem;
  padding-left: 2rem;
  outline: none;
  width: 100%;
`;

export const SearchFieldIcon = styled.img.attrs({
  alt: 'Search icon',
  src: SearchIconImage,
})`
  height: 100%;
  left: 0.5rem;
  object-fit: contain;
  object-position: center;
  position: absolute;
  top: 0;
  width: 1rem;
  z-index: 1;
`;
