import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import withStyles from '@material-ui/core/styles/withStyles';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

export const SearchContainer = styled.div`
  margin: 2rem 0;
  width: 18rem;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const InvitePeopleButton = styled.button`
  align-items: center;
  background-color: #d9036b;
  border-radius: 50%;
  box-shadow: 0 0.25rem 0.5rem rgba(46, 58, 67, 0.2);
  color: #fff;
  display: flex;
  height: 3.375rem;
  justify-content: center;
  width: 3.375rem;
`;

export const InvitePeoplePopoverContainer = styled.div`
  background-color: #f3f5f6;
`;

export const InvitePeoplePopoverSection = styled.div`
  max-width: 29rem;
  padding: 1rem;
  width: 29rem;
`;

export const InvitePopoverCloseButton = styled.button`
  color: #2e3a43;
  cursor: pointer;
  font-size: 2rem;
`;

export const InvitePopoverDivider = styled.div`
  background-color: #dedee2;
  height: 0.0625rem;
  width: 100%;
`;

export const StyledTextField = withStyles({
  root: {
    backgroundColor: '#fff',
    border: '0',
  },
})(TextField);

export const StyledFormControl = withStyles({
  root: {
    marginBottom: '0.5rem',
  },
  marginDense: {
    margin: 0,
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
      color: '#e40909',
    },
  },
  error: {
    color: '#e40909',
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
    border: '0.0625rem solid #e4090900',
    borderRadius: '0.25rem',
    transition: 'all 0.2s ease-out',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: '0.25rem',
    paddingBottom: 0,
    padding: '0.6rem 0.5rem',
    '&:focus': {
      backgroundColor: '#fff',
      border: 0,
      boxShadow: 'none',
    },
  },
  error: {
    border: '0.0625rem solid #e40909',
  },
})(InputBase);

export const PopoverSectionButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 100%;
`;

export const PopoverSectionButton = styled.button`
  align-items: center;
  color: #009fcd;
  cursor: pointer;
  display: flex;
  font-size: 0.875rem;
  ${props => props.bold && 'font-weight: 600;'}
  height: 3.5rem;
  justify-content: center;
  margin: 0;
  width: 8.75rem;
`;

export const PopoverErrorLabel = styled.div`
  color: #e40909;
  font-size: 0.75rem;
`;

export const PopoverErrorCollapse = withStyles({
  container: {
    marginBottom: '0.25rem',
  },
})(Collapse);
