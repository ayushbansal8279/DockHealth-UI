import { ListItem, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from '../../../palette';

export const MemberTypeLabelButton = styled.div`
  cursor: pointer;
  filter: brightness(1);
  min-width: 6.375rem;
  padding: 0.5rem;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.25s ease-out;
  white-space: nowrap;
  width: min-content;

  ${props =>
    props.invited
      ? `background-color: ${palette.lightGrey}; color: ${palette.coolGrey2};`
      : `background-color: ${palette.coolGrey2}; color: ${palette.white};`}

  &:hover {
    filter: brightness(1.05);
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
