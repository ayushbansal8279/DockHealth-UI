import styled from 'styled-components';
import { Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const StyledPopover = withStyles({
  paper: {
    border: 'none',
    boxShadow: 'none',
    width: ({ width }) => width,
    overflow: 'visible',
  },
})(Popover);

export const StyledButton = styled.button`
  width: 100%;
`;
