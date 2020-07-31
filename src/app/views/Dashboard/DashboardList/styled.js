import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import { Grid } from '@material-ui/core';

export const ToolbarContainer = styled(Grid)`
  border-bottom: 2px solid #f5f8fa;
  margin-bottom: 30px;
  margin-top: 50px;
  position: relative;
`;

export const SearchContainer = styled(Grid)`
  display: flex;
  justify-content: flex-end;
`;

export const SearchGrid = styled(Grid)`
  display: flex;
  width: ${({ isFocused }) => (isFocused ? 300 : 110)}px;
  transition: width 0.2s ease-out;
  justify-content: flex-end;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${palette.white};
  padding: 0 55px ${spacing.regular} 55px;
`;

export const DashboardTasksGroupContainer = styled.div`
  padding-bottom: 50px;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const DashboardTasksGroupLabel = styled.div`
  font-size: 1.125rem;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding: ${spacing.smallPlus};
  border-bottom: 1px solid ${palette.coolGrey2};
  margin: 0 55px;
  background-color: ${palette.coolGrey4};
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

export const DasboardTabsContainer = styled.div`
  height: 100%;
  display: flex;
`;

export const DashboardTab = styled.button`
  margin-right: 16px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.isSelected && '#00a2e5'};

  &:focus {
    outline: none;
  }
`;

export const DashboardTabHighlight = styled.div`
  background-color: #00a2e5;
  height: 4px;
  position: absolute;
  bottom: -3px;
  width: ${props => props.width};
  left: ${props => props.left};
  transition: left 0.2s ease-out;
`;

export const AssignedBox = styled.div`
  display: flex;
  justify-content: center;
`;
