import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import { Tab } from '@mui/material';

export const PatientDetailsTabsContainer = styled.div`
  background-color: ${palette.white};
`;

export const PatientDetailsContainer = styled.div`
  padding: ${spacing.huge} ${spacing.large};
  background-color: ${palette.coolGrey4};
  min-height: 100vh;
`;

export const MainTab = styled(Tab)`
  &.MuiTab-wrapper {
    font-weight: ${fontWeights.bold};
    font-size: ${fontSizes.regularPlus};
  }
`;

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
`;

export const NewDrawerContainer = styled.div`
  min-width: 400px;
  background-color: ${palette.white};
  z-index: 50;
  border-right: 1px solid ${palette.iron};
`;