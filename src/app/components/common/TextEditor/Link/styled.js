import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ButtonContainer = styled.div`
  margin-top: ${spacing.regular};
  display: flex;
`;

export const LinkButtonContainer = styled.div`
  display: inline-block;
`;

export const TextContainer = styled.p`
  display: inline-block;
  font-size: ${fontSizes.regularPlus};
  box-sizing: border-box;
`;

export const PopoverContainer = styled.div`
  padding: ${spacing.regular};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  background-color: ${palette.white};
  width: 300px;
`;

export const LinkButton = styled.button`
  display: inline-block;
  background: #fbfbfb;
  color: #888;
  font-size: 18px;
  border: 0;
  padding-top: 5px;
  vertical-align: bottom;
  height: 34px;
  width: 36px;
  &:hover,
  &:focus {
    background: #f3f3f3;
    outline: 0;
  }
`;
