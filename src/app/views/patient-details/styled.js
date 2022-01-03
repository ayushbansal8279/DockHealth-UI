/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import { Tab } from '@material-ui/core';

export const PatientDetailsTabsContainer = styled.div`
  padding: 0 ${spacing.huge};
  background-color: ${palette.white};
`;

export const PatientStickyContainer = styled.div`
  position: sticky;
  left: 0px;
  width: calc(100vw - 83px);
`;

export const PatientToolbarStickyContainer = styled.div`
  position: sticky;
  left: 24px;
  width: calc(100vw - 115px);
  z-index: 13;
`;

export const PatientDetailsContainer = styled.div`
  padding: ${spacing.huge} ${spacing.large};
  background-color: ${palette.coolGrey4};
`;

export const MainTab = styled(Tab)`
  .MuiTab-wrapper {
    font-weight: ${fontWeights.bold};
    font-size: ${fontSizes.regularPlus};
  }
`;
