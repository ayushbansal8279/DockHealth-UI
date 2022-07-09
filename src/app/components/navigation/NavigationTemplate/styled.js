import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'styles/palette';
import { Drawer } from '@material-ui/core';

export const DrawerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  flex-flow: row nowrap;
`;

export const useDrawerClasses = makeStyles({
  drawer: {
    position: 'relative',
    zIndex: 10,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    position: 'static',
    transform: ({ isNavbarVisible }) =>
      isNavbarVisible ? 'translateX(0px)' : 'translateX(-100%)',
    backgroundColor: palette.midnightBlue,
    border: 0,
    overflow: 'initial',
    width: 'auto',
  },
});

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
`;
