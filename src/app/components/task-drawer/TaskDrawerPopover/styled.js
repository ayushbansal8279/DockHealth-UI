import styled from 'styled-components';
import { Popover } from '@mui/material';
import palette from '@/app/styles/palette';

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

export const PopoverDiv = styled.div`
  overflow: auto;
  width: 100%;
  background-color: white;
  min-width: 200px;
  height: ${({height}) => height}px;


  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 11px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.white};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid ${palette.white};
    background-color: ${palette.coolGrey1};
  }
`;
