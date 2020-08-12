/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch } from '@material-ui/core';

export const ToolbarContainer = styled(Grid)`
  position: relative;
  height: 42px;
  border-bottom: 2px solid ${palette.blueGrey};
  margin-bottom: ${spacing.largePlus};
`;

export const ActionsContainer = styled(Grid)`
  display: flex;
  justify-content: flex-end;
`;

export const SearchGrid = styled(({ isFocused, ...otherProps }) => (
  <Grid {...otherProps} />
))`
  display: flex;
  width: ${({ isFocused }) => (isFocused ? 300 : 115)}px;
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

export const DasboardTabsContainer = styled.div`
  height: 100%;
  display: flex;
`;

export const DashboardTab = styled.button`
  margin-right: ${spacing.giga};
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: ${fontWeights.bold};
  color: ${props => props.isSelected && palette.brightBlue};

  &:focus {
    outline: none;
  }
`;

export const DashboardTabHighlight = styled.div`
  background-color: ${palette.brightBlue};
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

export const EmptyStateContainer = styled.div`
  padding: 0 55px;
`;

export const TipsSwitch = withStyles({
  switchBase: {
    color: palette.coolGrey4,
    '&$checked': {
      color: palette.darkBlue,
    },
    '&$checked + $track': {
      backgroundColor: 'rgba(33, 109, 194, 0.38)',
    },
  },
  checked: {},
  track: {},
})(Switch);

export const TipsSwitchLabel = styled.label`
  font-family: 'Montserrat', sans-serif;
  color: ${palette.coolGrey1};
  font-weight: ${fontWeights.regular};
  vertical-align: middle;
  text-transform: uppercase;
`;
