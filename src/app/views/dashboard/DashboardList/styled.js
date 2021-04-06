/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import { Grid } from '@material-ui/core';

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

export const DashboardSortBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: ${fontWeights.regular};
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding: ${spacing.small} {spacing.tiny};
  border: 1px solid ${palette.coolGrey3};
  margin-bottom: 3px;
`;

export const DashboardSortBarLabelName = styled.div`
  position: relative;
  flex: ${({ width, extendedWidth, groupHasMultipleAssignees }) =>
    width ? `${groupHasMultipleAssignees ? extendedWidth : width} 0 0` : '1'};
  padding: ${({ paddingLeft = spacing.tiny, paddingRight = spacing.tiny }) =>
    `${spacing.tiny} ${paddingRight} 0 ${paddingLeft}`};
  height: 35px;
  overflow: visible;
  text-align: left;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.mediumGrey};
  display: flex;
  align-items: center;
  text-transform: uppercase;
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.small};
  margin-left: 55px;
  margin-right: 55px;
`;

export const DroppableBox = styled.div`
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

export const DashboardTasksGroupHeader = styled.div`
  align-items: center;
  display: flex;
  margin-left: 55px;
`;

export const GroupNameSectionWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const DashboardTasksGroupLabelName = styled.span`
  display: inline-block;
  max-width: calc(100% - 40px);
  padding-right: ${spacing.tiny};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-family: 'Montserrat', sans-serif;
`;

export const DashboardTasksGroupLabel = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
`;

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${spacing.smallPlus};
`;
