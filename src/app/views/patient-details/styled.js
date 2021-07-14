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

export const PatientDetailsContainer = styled.div`
  padding: ${spacing.small} ${spacing.huge};
  background-color: ${palette.coolGrey4};
`;

export const SearchWrapper = styled.div`
  width: ${({ fullWidth }) => (fullWidth ? 374 : 115)}px;
  transition: width 0.25s ease-out;
`;

export const MainTab = styled(Tab)`
  .MuiTab-wrapper {
    font-weight: ${fontWeights.bold};
    font-size: ${fontSizes.regularPlus};
  }
`;
