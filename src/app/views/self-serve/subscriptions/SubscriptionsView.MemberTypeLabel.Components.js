import { ListItem, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from '../../../palette';

export const MemberTypeLabelButton = styled.span`
  ${props =>
    props.clickable &&
    `
    color: ${palette.cyanBlue};
    cursor: pointer;
    filter: brightness(1);
    transition: all 0.25s ease-out;

    &:hover {
      color: ${palette.cyanBlue};
      filter: brightness(1.35);
    }
  `}
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
