import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import { Tab } from '@mui/material';

export const ProfileDetailsTabsContainer = styled.div`
  padding: 0 ${spacing.huge};
  background-color: ${palette.white};
`;

export const ProfileDetailsContainer = styled.div`
  padding: ${spacing.huge} ${spacing.large};
  background-color: ${palette.coolGrey4};
`;

export const MainTab = styled(Tab)`
  &.MuiTab-wrapper {
    font-weight: ${fontWeights.bold};
    font-size: ${fontSizes.regularPlus};
  }
`;
