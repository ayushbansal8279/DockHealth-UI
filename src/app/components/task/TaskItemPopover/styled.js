import palette from '@/app/styles/palette';
import styled from 'styled-components';

export const Button = styled.button`
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
  height: 100%;
  ${({ fullWidth }) =>
    fullWidth &&
    `
      width: 100%; 
      text-align: left;
    `}
`;

export const PopoverDiv = styled.div`
  overflow: auto;
  width: 100%;
  background-color: white;
  min-width: 200px;

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
