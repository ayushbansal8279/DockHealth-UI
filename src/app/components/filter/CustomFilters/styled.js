import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const CustomFiltersContainer = styled.div`
  
`;

export const Label = styled.div`
color: ${palette.mediumGrey};
font-family: Outfit;
font-size: 14px;
font-style: normal;
font-weight: 400;
margin: 0 0 5px 5px;
`;

export const OptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 550px;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:vertical {
    width: 11px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: ${palette.coolGrey2};
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;
