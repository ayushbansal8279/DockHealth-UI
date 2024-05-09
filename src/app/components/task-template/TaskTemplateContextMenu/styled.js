import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 10002;
`;

export const MenuContainer = styled.ul`
  position: fixed;
  top: ${({ positionTop }) => positionTop};
  left: ${({ positionLeft }) => positionLeft};
  width: 185px;
  margin: 0;
  padding: ${spacing.small} 0;
  background-color: ${palette.white};
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.1);
  z-index: 10003;
  font-family: inherit;
  font-weight: ${fontWeights.light};
`;

export const MenuItemButton = styled.button`
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

export const Divider = styled.hr`
  margin: ${spacing.small} 0;
  border-color: ${palette.blueGrey};
`;
