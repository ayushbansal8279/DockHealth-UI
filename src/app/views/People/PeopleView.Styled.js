import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const SearchContainer = styled.div`
  margin: 2rem 0;
  width: 18rem;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const InvitePeopleButton = styled.button`
  align-items: center;
  background-color: ${palette.vividPink};
  border-radius: 50%;
  box-shadow: 0 0.25rem 0.5rem ${opacify(palette.greyBlue, 0.2)};
  color: ${palette.white};
  display: flex;
  height: 3.375rem;
  justify-content: center;
  width: 3.375rem;
`;

export const InvitePeoplePopoverContainer = styled.div`
  background-color: ${palette.lightGrey};
`;

export const InvitePeoplePopoverSection = styled.div`
  max-width: 29rem;
  padding: 1rem;
  width: 29rem;
`;

export const InvitePopoverCloseButton = styled.button`
  color: ${palette.greyBlue};
  cursor: pointer;
  font-size: 2rem;
`;

export const InvitePopoverDivider = styled.div`
  background-color: ${palette.unknownGrey6};
  height: 0.0625rem;
  width: 100%;
`;

export const StyledTextField = withStyles({
  root: {
    backgroundColor: palette.white,
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
  color: ${palette.lightCyanBlue};
  cursor: pointer;
  display: flex;
  font-size: 0.875rem;
  ${props => props.bold && 'font-weight: 600;'}
  height: 3.5rem;
  justify-content: center;
  margin: 0;
  width: 8.75rem;
`;
