import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

export const DashboardContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding: 28px 55px;
`;

export const DashboardTasksGroupContainer = styled.div`
  padding: 28px 0 68px; // per design

  &:last-child {
    padding-bottom: 0;
  }
`;

export const DashboardTasksGroupLabel = styled.div`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding-bottom: ${spacing.large};
  border-bottom: 1px solid ${palette.coolGrey2};
  width: 100%;
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
`;
