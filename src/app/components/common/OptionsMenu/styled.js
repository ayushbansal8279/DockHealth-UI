import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const MenuContainer = styled.ul`
  width: ${({ width }) => `${width}px`};
  margin: 0;
  padding: ${spacing.small} 0;
  background-color: ${palette.white};
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: ${fontWeights.light};
`;

export const MenuOptionButtom = styled.button`
  width: 100%;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  text-align: left;
  cursor: pointer;
  color: ${({ color }) => color || palette.mediumGrey};

  &:hover,
  &:focus {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const StyledButton = styled.button`
  display: block;
`;
