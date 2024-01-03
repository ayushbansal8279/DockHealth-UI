import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const ActivityAlertsItemContainer = styled.div`
  font-family: Montserrat;
  display: flex;
  flex-direction: column;
  max-height: 200px;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%),
    #ffffff; // per design
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15); // per design
  border-radius: 8px;
  margin-bottom: ${spacing.regular};
  padding: ${spacing.smallPlus} ${spacing.smallPlus} ${spacing.smallExtraPlus}
    ${spacing.smallExtraPlus};
  position: relative;
`;

export const ActivityAlertsItemOrganizationAvatar = styled.div`
  background-color: ${(props) => props.organizationProfileColor};
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
  font-family: ${typography.text};
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
  font-family: Montserrat;

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

export const ActivityAlertItemTitle = styled.div`
  font-family: ${typography.text};
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.bold};
  margin-right: ${spacing.huge};
`;

export const ActivityAlertItemSubTitle = styled.div`
  font-family: ${typography.text};
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};
  margin-right: ${spacing.huge};
`;

export const CompletedCircleIcon = styled.img`
  width: 22;
  height: 22;
  margin-right: ${spacing.small};
`;

export const StyledDescriptionTaskLink = styled.span`
  font-family: ${typography.text};
  font-weight: ${fontWeights.bold};
  color: ${palette.brightBlue};
  cursor: pointer;
`;

export const StyledTaskLink = styled(StyledDescriptionTaskLink)`
  font-family: ${typography.text};
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regular};
  color: ${palette.brightBlue};
  cursor: pointer;
`;

export const StyledCrossIcon = styled.img`
  cursor: pointer;
  margin-left: ${spacing.smallPlus};
`;

export const StyledFooter = styled.div`
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 0 0 8px 8px;
  padding-bottom: ${spacing.small};

  & > span {
    color: ${palette.brightBlue};
    font-weight: ${fontWeights.regularPlus};
    cursor: pointer;
    margin-right: ${spacing.regular};
  }
`;
