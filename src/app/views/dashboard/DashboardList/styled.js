import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

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

export const DashboardTaskItemContainer = styled.div`
  margin-bottom: 3px;
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
