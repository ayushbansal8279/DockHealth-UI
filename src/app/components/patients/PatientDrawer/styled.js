/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import Drawer from '@mui/material/Drawer';

export const MoreActinsWrapper = styled.div`
  display: flex;
  width: auto;
`;

export const ContentWrapper = styled.div`
  padding: 0px 0px 48px 0px;
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
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  background: ${palette.white};
`;

export const DrawerWrapper = styled(Drawer)`
  &.MuiDrawer-docked {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .MuiDrawer-paper {
    width: 500px;
  }
`;

export const UpgradePlanContainer = styled.div`
  display: flex;
  padding: ${spacing.regular} ${spacing.smallPlus};
  justify-content: center;
`;
