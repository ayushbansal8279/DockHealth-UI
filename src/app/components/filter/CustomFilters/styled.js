/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const CustomFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 180px 0 0;
  overflow: hidden;
  margin-right: ${spacing.large};
`;

export const Label = styled.p`
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.lightGrey};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const OptionsList = styled.div`
  flex: 1;
  overflow-y: auto;

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
