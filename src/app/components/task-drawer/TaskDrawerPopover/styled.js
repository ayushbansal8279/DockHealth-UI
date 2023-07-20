import styled from 'styled-components';
import { Popover } from '@mui/material';

export const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    border: none;
    box-shadow: none;
    width: ${({ width }) => width};
    overflow: visible;
  }
  .MuiBackdrop-root {
    opacity: 0 !important;
  }
`;

export const StyledButton = styled.button`
  width: 100%;
`;
