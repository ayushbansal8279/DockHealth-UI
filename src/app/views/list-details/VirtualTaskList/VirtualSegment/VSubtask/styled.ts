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
        ? '37px'
        : searchValue || isFilterApply || isSortApplied
        ? '53.5px'
        : '87px'
      : searchValue || isFilterApply || isSortApplied
      ? '54.5px'
      : hasCustomOffset
      ? '36px'
      : '87px'};
  margin-bottom: -5px;
  background: ${({ bgColor }: any) => (bgColor ? palette.aliceBlue : '')};
`;

export const QuickAddContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  width: ${({ $width }: any) => $width};
  position: sticky;
  left: ${({ hasCustomOffset }: any) => (hasCustomOffset ? '37px' : '89.5px')};

  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;

export const WorkflowQuickAddTaskContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  // width: 90%;
  width: ${({ $width }: any) => $width};
  left: ${({ disableLeftOffset }: any) =>
    disableLeftOffset ? '0px' : '54.5px'};
  margin-top: ${({ subtaskQuickAddOpen }: any) =>
    subtaskQuickAddOpen ? '1px' : ''};
  position: sticky;
  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
