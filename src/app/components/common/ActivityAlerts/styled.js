import styled, { keyframes, css } from 'styled-components';
import { Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const rotateImg = keyframes`
  0% {
    transform: rotate(0);
  }

  12.5% {
    transform: rotate(25deg);
  }


  25% {
    transform: rotate(0);
  }


  37.5% {
    transform: rotate(-25deg);
  }

  50% {
    transform: rotate(0);

  }

  62.5% {
    transform: rotate(25deg);
  }

  75% {
    transform: rotate(0);
  }


  87.5% {
    transform: rotate(-25deg);
  }

  100% {
    transform: rotate(0);
  }
`;

export const ActivityAlertsImg = styled.img`
  cursor: pointer;
  animation: ${props =>
    props.withAnimaton
      ? css`
          ${rotateImg} 0.55s ease-in-out 0.25s
        `
      : ''};
`;

export const ActivityAlertsPopover = withStyles({
  paper: () => ({
    border: 'none',
    boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.15)', // per design
    width: '515px',
    borderRadius: '8px',
    backgroundColor: palette.coolGrey4,
  }),
})(Popover);

export const ActivityAlertsPopoverLabel = styled.div`
  color: black;
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
  font-family: Montserrat;
  margin-right: ${spacing.smallPlus};
`;

export const ActivityAlertsList = styled.div`
  padding: ${spacing.small} ${spacing.large} ${spacing.large};
  max-height: 600px;
  overflow-y: scroll;
`;

export const ActivityAlertsClearAllLabel = styled.div`
  display: flex;
  align-items: center;
  font-family: Montserrat;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.regularPlus};
  cursor: pointer;
  margin-right: ${spacing.tiny};
`;

export const ActivityAlertsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.large} ${spacing.large} ${spacing.smallPlus};
`;

export const ActivityAlertsSwitchLabel = styled.label`
  font-family: Montserrat;
  font-weight: ${fontWeights.regularPlus};
  font-size: ${fontSizes.regular};
  line-height: 20px;
  letter-spacing: 0.307692px;
  text-transform: uppercase;
  color: ${palette.coolGrey2};
`;

export const EmptyActivityAlerts = styled.div`
  display: flex;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%),
    #ffffff; // per design
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15); // per design
  border-radius: 8px;
  padding: ${spacing.regularPlus};
  font-family: Roboto Condensed;
  font-weight: ${fontWeights.bold};
`;

export const ActivityAlertsHeaderLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${palette.mediumGrey};
`;

export const ActivityAlertsToastsContainer = styled.div`
  overflow-y: scroll;
  position: absolute;
  height: 100%;
  width: 100%;
  right: -17px;
`;

export const SettingsButton = styled.button`
  cursor: pointer;
  margin-left: ${spacing.smallPlus};
`;

export const ActivityAlertsOptions = styled.div`
  display: flex;
`;
