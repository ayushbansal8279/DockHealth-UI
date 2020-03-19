import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

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
