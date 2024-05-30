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

  &::before {
    content: '';
    display: block;
    background: ${({ backgroundColor }) => backgroundColor || palette.white};
    position: absolute;
    left: -100px;
    // padding-bottom: 40px;
    // padding-bottom: ${({ height }) => height || '0px'};
    // top: -1px;
    width: 100px;
    height: calc(100%);
    // z-index: -1;
    @media print {
      left: -102px;
    }
  }
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
  background: ${({ backgroundColor }) =>
    backgroundColor ? palette.aliceBlue : ''};
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
  // margin-top: ${spacing.small};
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
  background: ${({ backgroundColor }) =>
    backgroundColor ? palette.aliceBlue : ''};
  // height: 35px;
  padding-bottom: 10px;
  padding-top: 10px;
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

export const NumericalBadgeContainer = styled.div`
  height: 20px;
  border-radius: 2px;
  border: 1px solid
    ${({ $areNewTasksAdded }) =>
      $areNewTasksAdded ? palette.crystalBlue : palette.iron};
  background: ${({ $areNewTasksAdded }) =>
    $areNewTasksAdded ? palette.crystalBlue : palette.whiteSmoke};
  padding: 4px 7px 4px 7px;
  gap: 7px;
  margin-left: 6px;
  margin-top: 3px;
  opacity: 0px;
`;

export const TaskCount = styled(Typography)`
  color: ${({ $areNewTasksAdded }) =>
    $areNewTasksAdded ? palette.white : palette.shadowBlue};
  font-family: Outfit;
  font-weight: 500;
  font-size: 12px;
  line-height: 11.19px;
  &.MuiTypography-root {
    text-align: center;
  }
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
  margin-bottom: 2px;
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
