import styled from '@mui/styled-engine';
import palette, { featurePalette, typography } from 'styles/palette';

export const VSubtask = styled('div')`
  position: relative;
  display: flex;
  font-size: 13px;
  line-height: 40px;
  height: 40px;
  border-left: 1px solid rgb(229, 233, 242);
  margin-left: ${({
    isWorkflowSubtask,
    searchValue,
    isFilterApply,
    isSortApplied,
    hasCustomOffset,
  }: any) =>
    isWorkflowSubtask
      ? hasCustomOffset
        ? '61px'
        : searchValue || isFilterApply || isSortApplied
        ? '53.5px'
        : '87px'
      : searchValue || isFilterApply || isSortApplied
      ? '54.5px'
      : hasCustomOffset
      ? '60px'
      : '87px'};
  margin-bottom: -5px;
  background: ${({ bgColor }: any) => (bgColor ? palette.aliceBlue : '')};
`;

export const QuickAddContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  width: ${({ $width }: any) => $width};
  position: sticky;
  ${({ hasCustomOffset, isNarrowView }: any) =>
    hasCustomOffset
      ? isNarrowView
        ? 'left: 62px'
        : 'margin-left: 62px'
      : 'left: 89.5px'};

  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;

export const WorkflowQuickAddTaskContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  // width: 90%;
  width: ${({ $width }: any) => $width};
  ${({ disableLeftOffset, isNarrowView }: any) =>
    disableLeftOffset
      ? isNarrowView
        ? 'left: 24px'
        : 'margin-left: 24px'
      : 'left: 54.5px'};
  margin-top: ${({ subtaskQuickAddOpen }: any) =>
    subtaskQuickAddOpen ? '1px' : ''};
  position: sticky;
  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
