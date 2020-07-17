import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import { Grid } from '@material-ui/core';

export const SearchGrid = styled(Grid)`
  width: ${({ isFocused }) => (isFocused ? 300 : 110)}px;
  transition: width 0.2s ease-out;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${palette.white};
  padding: 0 55px ${spacing.regular} 55px;
`;

export const DashboardTasksGroupContainer = styled.div`
  padding-bottom: 10px;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const DashboardTasksGroupLabel = styled.div`
  font-size: 1.125rem;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding-bottom: ${spacing.smallPlus};
  border-bottom: 1px solid ${palette.coolGrey2};
  margin: 0 55px;
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.large};
`;

export const DroppableBox = styled.div`
  background-color: ${palette.coolGrey3};
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
