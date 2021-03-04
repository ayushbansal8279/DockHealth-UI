/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch } from '@material-ui/core';

export const ToolbarContainer = styled(Grid)`
  position: relative;
  height: 42px;
  border-bottom: 2px solid ${palette.blueGrey};
  margin-bottom: ${spacing.regular};
  flex-direction: column-reverse !important;
  align-items: flex-start !important;
  flex-wrap: inherit !important;

  @media screen and (min-width: 960px) {
    flex-direction: row !important;
    align-items: initial !important;
    flex-wrap: wrap;
  }
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
  padding: 0 55px ${spacing.small} 55px;
`;

export const DashboardTasksGroupContainer = styled.div`
  padding-bottom: 30px;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const DashboardTasksGroupLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: ${fontWeights.regular};
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding: ${spacing.tiny};
  border-bottom: 1px solid ${palette.coolGrey2};
  margin: 0 55px;
  background-color: ${palette.coolGrey4};
`;

export const DashboardTasksGroupLabelName = styled.div`
  position: relative;
  flex: ${({ width }) => (width ? `${width} 0 0` : '1')};
  padding: 8px 16px;
  height: 35px;
  overflow: visible;

  text-align: left;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
  color: ${palette.mediumGrey};
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.large};
  margin-left: 55px;
  margin-right: 55px;
`;

export const DroppableBox = styled.div`
  // background-color: ${palette.coolGrey3};
  border-radius: 4px;
`;

export const DasboardTabsContainer = styled.div`
  height: 100%;
  display: flex;
`;

export const DashboardTab = styled.button`
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: ${fontWeights.bold};
  color: ${props => props.isSelected && palette.brightBlue};

  &:not(:last-of-type) {
    margin-right: ${spacing.giga};
  }

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

export const EmptyStateContainer = styled.div`
  padding: 0 55px;
`;

export const TipsSwitchLabel = styled.label`
  font-family: 'Montserrat', sans-serif;
  color: ${palette.coolGrey1};
  font-weight: ${fontWeights.regular};
  vertical-align: middle;
  text-transform: uppercase;
`;

export const ShowMoreButton = styled.button`
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  margin-top: ${spacing.regular};
  margin-left: 72px;
  width: fit-content;
`;
