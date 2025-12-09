import styled from 'styled-components';
import { Checkbox } from '@mui/material';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const ActivityAlertsSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ActivityAlertsSettingsItem = styled.div`
  background-color: white;
  border-radius: 4px;
  padding: ${fontSizes.smallPlus};
  margin-bottom: ${fontSizes.smallPlus};
  border-radius: 4;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
  text-align: start;
  padding-right: 0;

  * > span {
    font-size: ${fontSizes.smallPlus};
    font-weight: normal;
  }
`;

export const ActivityAlertsSettingsItemsContainer = styled.div`
  font-family: inherit;
  margin-top: ${spacing.large};
  display: flex;
  flex-direction: column;
  padding: 0 ${spacing.large} ${spacing.large};
`;

export const ActivityAlertsSettingsItemsHeader = styled.div`
  padding-bottom: ${spacing.regular};
  font-family: 'Outfit', sans-serif;
`;

export const ActivityAlertsSettingsItemsHeaderLabel = styled.div`
  font-size: ${fontSizes.small};
  text-align: center;
  transition: opacity 0.2s ease;

  ${(props) =>
    props.$disabled &&
    `
    opacity: 0.4;
  `}
`;

export const ActivityAlertsSettingsItemsHeaderBlueLabel = styled.div`
  font-size: ${fontSizes.smallPlus};
  font-weight: bold;
  color: ${palette.brightBlue};
  text-align: start;
  margin-left: ${spacing.smallPlus};
`;

export const BlueCheckbox = styled(Checkbox)`
  &.MuiCheckbox-root {
    color: ${palette.brightBlue};
  }
`;
export const CheckboxContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;

  ${(props) =>
    props.$disabled &&
    `
    opacity: 0.4;
  `}
`;

export const ArrowButton = styled.button`
  cursor: pointer;
  width: 12px;
  margin-right: ${spacing.smallPlus};
`;

export const ActivityAlertsSettingsHeader = styled.div`
  display: flex;
  padding: ${spacing.large} ${spacing.large} ${spacing.smallPlus};
`;

export const AllEventsItem = styled(ActivityAlertsSettingsItem)`
  border: 1px solid ${palette.lightGrey};
`;
