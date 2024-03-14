import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import { Typography } from '@mui/material';

export const StickyHeader = styled.div`
  position: 'relative';
  z-index: 102;
  background-color: ${palette.white};
  padding: 0 55px 0 55px;
  @media print {
    display: none;
  }
`;

export const StickyElement = styled.div`
  z-index: ${({ zIndex }) => zIndex || 10};
  background-color: ${palette.white};
`;

export const VerticalScrollContainer = styled.div`
  padding: ${spacing.small} ${spacing.large};
  box-sizing: border-box;
  width: 100%;
  position: relative;
  background: ${palette.white};
`;

export const DashboardTaskGroupsWrapper = styled.div`
  width: fit-content;
`;

export const DashboardTasksGroupContainer = styled.div`
  padding-bottom: 30px;
  &:last-child {
    padding-bottom: 0;
  }
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.small};
`;

export const DroppableBox = styled.div`
  border-radius: 4px;
`;

export const EmptyStateContainer = styled.div`
  padding: 0 55px;
`;

export const ShowMoreButton = styled.button`
  font-family: 'Outfit', sans-serif;
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
`;

export const GroupNameSectionWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const DashboardTasksGroupLabelName = styled.span`
  display: flex;
  max-width: calc(100% - 40px);
  padding-right: ${spacing.tiny};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-family: 'Outfit', sans-serif;
`;

export const DashboardTasksGroupNumericalBadgeContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 13px;
  border: 1px solid
    ${({ isActive }) => (isActive ? palette.crystalBlue : palette.iron)};
  color: ${({ isActive }) =>
    isActive ? palette.crystalBlue : palette.coolGrey1};
  background: ${({ isActive }) =>
    isActive ? palette.whiteSmoke : palette.lightGrey2};
  // padding: 4px 7px 4px 7px;
  gap: 7px;
  margin-left: 6px;
  margin-top: 2px;
`;

export const DashboardTasksGroupTaskCount = styled(Typography)`
  color: ${({ isActive }) =>
    isActive ? palette.crystalBlue : palette.coolGrey1};
  font-family: Outfit;
  font-weight: 500;
  font-size: 11px;
  line-height: 11.19px;
  &.MuiTypography-root {
    text-align: center;
  }
  margin-top: 4px;
`;

export const DashboardTasksGroupLabel = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;

export const DashboardTaskItemContainer = styled.div`
  &:hover {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15);
  }
`;

export const GroupOptionsContainer = styled.div`
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
`;

export const GroupOpenContainer = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  flex-basis: content;
  padding-left: 10px;
  padding-right: 10px;
`;
