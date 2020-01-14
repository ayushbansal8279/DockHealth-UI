import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import withStyles from '@material-ui/core/styles/withStyles';
import styled from 'styled-components';

export const MemberTypeLabelButton = styled.span`
  ${props =>
    props.clickable &&
    `
    color: #007cab;
    cursor: pointer;
    filter: brightness(1);
    transition: all 0.25s ease-out;

    &:hover {
      color: #007cab;
      filter: brightness(1.35);
    }
  `}
`;

export const StyledPopover = withStyles({
  paper: {
    border: '1px solid #DEDEE2',
    padding: '0.5rem 0',
  },
})(Popover);

export const StyledListItem = withStyles({
  root: {
    padding: '0.5rem 0.75rem',
    '&:hover': {
      backgroundColor: '#cddbe7',
    },
  },
})(ListItem);
