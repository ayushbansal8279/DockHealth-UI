import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import { H3 } from './SubscriptionsView.Styled';

export const MembersTableContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

export const MemberTable = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.smallPlus};
`;

export const MemberTableHeader = styled(Grid)`
  background-color: rgba(193, 204, 218, 0.3);
  margin: 0 !important;
  width: 100% !important;
`;

export const HeaderCaptionGrid = styled(Grid)`
  height: 2.25rem;
  min-height: 2.25rem;

  & > :first-child {
    margin-right: 1.5rem;
  }
`;

export const SwitcherContainer = styled.div`
  align-items: center;
  display: flex;
  cursor: pointer;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 100%;
`;

export const SwitcherChevronContainer = styled.div`
  height: 100%;
`;

export const MediumGreyLabelContainer = styled.span`
  color: ${palette.coolGrey1};
`;

export const SubscriptionStatusSwitchLabel = styled(H3)`
  cursor: pointer;
  margin-left: 2rem;
  ${props => props.selected && 'font-weight: bold; text-decoration: underline;'}
`;

export const MembersTableSearchContainer = styled.div`
  width: 14rem;
`;

export const MemberTypeButton = styled.button`
  max-width: 160px;
  width: 100%;
  outline: none;

  * > * {
    font-weight: normal;
    color: ${props => {
      if (props.isInvited || !props.clickable) return palette.coolGrey1;

      return palette.mediumGrey;
    }}
  
`;

export const SubscriptionLabelBox = styled.div`
  font-size: ${fontSizes.smallPlus};
  color: #4a4a4a; // custom color
  padding: ${spacing.tiny} 0;
  font-family: 'Montserrat', sans-serif;
`;
