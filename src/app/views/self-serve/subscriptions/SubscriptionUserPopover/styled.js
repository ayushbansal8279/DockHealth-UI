import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

// Common
export const LimitedAccessLabel = styled.span`
  font-family: 'Roboto Condensed';
  color: ${palette.orange};
  font-style: italic;
  font-weight: normal;
  margin-left: ${spacing.small};
`;

export const Header = styled.div`
  font-family: 'Roboto Condensed';
  background-color: ${palette.coolGrey4};
  width: 100%;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
  padding: ${spacing.regularPlus} 0 ${spacing.smallPlus} ${spacing.large};
  border-bottom: 0.5px solid ${palette.coolGrey3};
`;

// RoleSelectionPopover
export const RoleItem = styled.div`
  font-family: 'Roboto Condensed';
  display: flex;
  padding: 18px ${spacing.smallPlus};
  border: 1px solid ${palette.coolGrey3};
  border-radius: 9px;
  width: 408px;
  margin-bottom: ${spacing.smallPlus};
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'pointer')};
  background-color: ${props =>
    props.isSelected ? palette.coolGrey4 : 'transparent'};
  ${props => props.isDisabled && 'filter: grayscale(70%)'};
  position: relative;

  & > img {
    position: absolute;
  }

  & > div {
    margin-left: ${spacing.giga};
  }
`;

export const RoleItemLabel = styled.div`
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${props =>
    props.isSelected ? palette.brightBlue : palette.mediumGrey};
`;

export const RoleItemDescription = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};
`;

export const RoleSelectorFooter = styled.div`
  display: flex;
  justify-content: ${props =>
    props.multipleButtons ? 'space-between' : 'flex-end'};
  padding: ${spacing.regularPlus} ${spacing.largePlus} ${spacing.largePlus};
`;

export const RoleSelectorRemoveUserButton = styled.button`
  color: ${palette.brightBlue};
  outline: none;
`;

// InvitationPopover
export const InvitationItem = styled.div`
  font-family: 'Roboto Condensed';
  display: flex;
  padding: ${spacing.large} 40px;
  width: 408px;
  border-bottom: 0.5px solid ${palette.coolGrey3};
`;

export const InvitationItemLabel = styled.div`
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
`;

export const InvitationItemDescription = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};
  margin-bottom: ${spacing.smallPlus};
`;

// PendingApprovalPopover
export const PendingApprovalContainer = styled.div`
  font-family: 'Roboto Condensed';
  width: 462px;
  height: 385px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const PendingApprovalDescriptionOne = styled.div`
  font-size: ${fontSizes.smallPlus};
  color: ${palette.coolGrey1};
  padding: ${spacing.large} ${spacing.largePlus} 0;
`;

export const PendingApprovalDescriptionTwo = styled.div`
  font-size: ${fontSizes.smallPlus};
  color: ${palette.coolGrey1};
  padding: ${spacing.smallPlus} ${spacing.largePlus} ${spacing.large};
`;
export const PendingApprovalButtonsContainer = styled.div`
  display: flex;
  padding: ${spacing.large} ${spacing.largePlus};
  width: 100%;
`;

export const PendingApprovalRoleList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${spacing.smallPlus};
`;

export const PendingApprovalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${spacing.smallPlus} ${spacing.largePlus} 48px;
`;

export const DenyButtonContainer = styled.div`
  margin-right: 6px !important;
  width: 50%;
`;

export const ApprovalButtonContainer = styled.div`
  margin-left: 6px !important;
  width: 50%;
`;
