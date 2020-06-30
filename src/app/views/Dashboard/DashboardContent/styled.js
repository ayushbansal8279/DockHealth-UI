import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import { Grid } from '@material-ui/core';

export const SearchGrid = styled(Grid)`
  width: ${({ isFocused }) => (isFocused ? 300 : 110)}px;
  transition: width 0.2s ease-out;
`;

export const DashboardContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding: 28px 20px;
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
  margin: 0 55px;
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DashboardHeaderContainer = styled.div`
  padding: 0 55px;
`;

export const DroppableBox = styled.div`
  background-color: ${palette.coolGrey2};
  border-radius: 4px;
`;

export const EmptyDashboard = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 48px;

  & > p {
    font-weight: ${fontWeights.regularPlus};
  }
`;
