import styled from 'styled-components';
import palette from 'styles/palette';
import { Drawer } from '@mui/material';

export const DrawerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  flex-flow: row nowrap;
`;

export const SendBirdThemeColorSet = {
  '--sendbird-light-primary-500': '#00487c',
  '--sendbird-light-primary-400': '#4bb3fd',
  '--sendbird-light-primary-300': palette.midnightBlue,
  '--sendbird-light-primary-200': '#0496ff',
  '--sendbird-light-primary-100': '#027bce',
};

export const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 9;
  @media print {
    overflow-x: initial;
    overflow-y: initial;
  }
`;

export const MaterialDrawer = styled(Drawer)`
  @media print {
    display: none;
  }
  @media screen and (max-width: 800px) {
    display: none;
  }
  &.MuiDrawer-docked {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .MuiDrawer-paper {
    position: static;
    transform: ${({ $isNavbarVisible }) =>
      $isNavbarVisible ? 'translateX(0px)' : 'translateX(-100%)'};
    background-color: ${({ $navBackgroundColor }) =>
      $navBackgroundColor || palette.newDarkBlue};
    border: 0;
    overflow: initial;
    width: auto;
  }
`;
