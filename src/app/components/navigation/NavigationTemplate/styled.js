import styled from 'styled-components';
import palette from 'styles/palette';
import { Drawer } from '@mui/material';

export const DrawerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  flex-flow: row nowrap;
`;

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
