import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const DashboardSettingsContainer = styled.div`
  background-color: white;
  padding: ${spacing.regularPlus};
  width: 230px;
  height: 240px;
  box-shadow: 0px 4px 11px grey;
`;

export const DashboardSettingsHeader = styled.div`
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  margin-bottom: ${spacing.large};
`;

export const DashboardSettingsOption = styled.div`
  display: flex;
  margin-left: ${spacing.small};
  padding-bottom: ${spacing.regular};

  & > button {
    margin-top: 6px;
  }
`;

export const DashboardSettingsLabel = styled.label`
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  margin-left: ${spacing.small};
`;

export const DashboardSettingsIcon = styled.img`
  cursor: pointer;
  height: 28px;
  margin-top: 4px;
`;
