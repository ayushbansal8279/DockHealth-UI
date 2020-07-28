import styled from 'styled-components';
import { Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const StyledPopover = withStyles({
  paper: {
    border: 'none',
    overflow: 'visible',
  },
})(Popover);

export const ButtonsWrapper = styled.div`
  padding: ${spacing.smallPlus} 0;
  background: ${palette.white};
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
`;

export const Button = styled.button`
  display: block;
  width: 100%;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  font-weight: ${fontWeights.bold};
  text-align: left;
  outline: none;
  color: ${palette.darkGrey};

  &:hover {
    cursor: pointer;
    background: ${palette.blueGrey};
  }
`;
