import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PopoverContainer = styled.div`
  width: 317px;
  background-color: ${palette.white};
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  font-family: 'Roboto Condensed', sans-serif;
`;

export const SuggestionsContainer = styled.div`
  max-height: 200px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

export const Spacer = styled.hr`
  margin: 0 ${spacing.small};
  border-color: ${palette.coolGrey3};
  height: 0.5px;
`;
