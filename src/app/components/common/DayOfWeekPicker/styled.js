import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const DayButton = styled.button`
  width: 36px;
  height: 30px;
  border: 1px solid ${palette.coolGrey2};
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.bold};
  font-family: 'Outfit', sans-serif;

  &:not(:last-of-type) {
    border-right: none;
  }

  ${({ isSelected }) =>
    isSelected &&
    `
    color: ${palette.white};
    background-color: ${palette.brightBlue}; 
    border-top-color: ${palette.brightBlue}; 
    border-bottom-color: ${palette.brightBlue}; 
  `}
`;
