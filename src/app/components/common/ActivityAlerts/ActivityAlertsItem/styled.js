import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const ActivityAlertsItemContainer = styled.div`
  font-family: Montserrat;
  display: flex;
  flex-direction: column;
  height: 160px;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%),
    #ffffff; // per design
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15); // per design
  border-radius: 8px;
  margin-bottom: ${spacing.regular};
  padding: ${spacing.smallPlus} ${spacing.smallPlus} ${spacing.smallExtraPlus}
    ${spacing.smallExtraPlus};
`;

export const ActivityAlertsItemOrganizationAvatar = styled.div`
  background-color: ${props => props.organizationProfileColor};
  font-size: 15px; // per design
  font-weight: ${fontWeights.bold};
  width: 25px;
  height: 25px;
  border-radius: 1.66px;
  color: white;
  text-align: center;
  line-height: 25px;
  text-transform: lowercase;
`;

export const ActivityAlertsItemOrganizationLabel = styled.div`
  font-family: Roboto Condensed;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding-left: 10px; // per design
  font-size: ${fontSizes.regular};
  text-transform: uppercase;
  line-height: 26px;
`;

export const ActivityAlertsItemHeader = styled.div`
  display: flex;
  margin-bottom: ${spacing.regularPlus};
  justify-content: space-between;

  & > div {
    display: flex;
  }
`;

export const ActivityAlertsItemTime = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: ${fontSizes.small};
  line-height: 26px;
`;

export const ActivityAlertsItemClearLabel = styled.div`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.small};
  margin-left: ${spacing.smallPlus};
  cursor: pointer;
  line-height: 26px;
  font-weight: ${fontWeights.regularPlus};
`;

export const ActivityAlertsItemLabel = styled.div`
  font-family: Roboto Condensed;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.bold};
  margin-right: ${spacing.huge};
`;

export const ActivityAlertsItemDescription = styled.div`
  font-family: Roboto Condensed;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};] 
`;

export const ActivityAlertItemQuotes = styled(ActivityAlertsItemDescription)`
  margin-right: ${spacing.huge};
`;

export const CompletedCircleIcon = styled.img`
  width: 22;
  height: 22;
  margin-right: ${spacing.small};
`;

export const StyledDescriptionTaskLink = styled.span`
  font-family: Roboto Condensed;
  font-weight: ${fontWeights.bold};
  color: ${palette.brightBlue};
  cursor: pointer;
`;

export const StyledTaskLink = styled(StyledDescriptionTaskLink)`
  font-family: Roboto Condensed;
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regular};
  color: ${palette.brightBlue};
  cursor: pointer;
`;

export const StyledCrossIcon = styled.img`
  cursor: pointer;
  margin-left: ${spacing.smallPlus};
`;
