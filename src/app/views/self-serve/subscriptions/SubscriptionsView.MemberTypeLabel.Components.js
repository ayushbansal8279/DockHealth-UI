import { ListItem, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from '../../../palette';

export const MemberTypeLabelButton = styled.div`
  background-color: ${palette.coolGrey2};
  color: ${palette.white};
  cursor: pointer;
  filter: brightness(1);
  padding: 0.5rem;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.25s ease-out;
  width: min-content;
  white-space: nowrap;

  &:hover {
    background-color: ${palette.coolGrey2};
    color: ${palette.white};
  }
`;

export const StyledPopover = withStyles({
  paper: {
    border: `1px solid ${palette.unknownGrey6}`,
    padding: '0.5rem 0',
  },
})(Popover);

export const StyledListItem = withStyles({
  root: {
    padding: '0.5rem 0.75rem',
    '&:hover': {
      backgroundColor: palette.coolGrey2,
    },
  },
})(ListItem);
