import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const DatepickerOptionLabelContainer = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  color: ${palette.darkGrey};
  cursor: pointer;

  ${props => props.isSelected && `&& > * { font-weight: ${fontWeights.bold}; }`}

  &:disabled {
    cursor: initial;
  }

  &:hover:not(:disabled) {
    background-color: ${palette.coolGrey4};

    && > * {
      font-weight: ${fontWeights.bold};
    }
  }
`;

export const StyledPopover = withStyles({
  paper: {
    minWidth: '293px',
    border: 'none',
    boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.17)',
  },
})(Popover);
