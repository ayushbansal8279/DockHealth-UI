import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import Drawer from '@mui/material/Drawer';

export const MoreActionsWrapper = styled.div`
  display: flex;
  width: auto;
`;

export const ContentWrapper = styled.div`
  padding: 0px 20px 48px 10px;
  box-sizing: border-box;
`;

export const TitleName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  background: ${palette.white};
`;

export const DrawerWrapper = styled(Drawer)`
  &.MuiDrawer-paper {
    width: 500px;
  }
`;
