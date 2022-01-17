/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

export const MoreActinsWrapper = styled.div`
  display: flex;
  width: auto;
`;

export const ContentWrapper = styled.div`
  padding: 0px 20px 48px 20px;
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
  .MuiDrawer-paper {
    width: 500px;
  }
`;

export const UpgradePlanContainer = styled.div`
  display: flex;
  padding: ${spacing.regular} ${spacing.smallPlus};
  justify-content: center;
`;
