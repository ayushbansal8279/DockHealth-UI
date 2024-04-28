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
  }) =>
    isWorkflowSubtask
      ? '89.5px'
      : searchValue || isFilterApply || isSortApplied
      ? '54.5px'
      : '90.5px'};
  margin-bottom: -5px;
  margin-top: -1px;
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
`;

export const QuickAddContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  width: ${({ $width }) => $width};
  margin-bottom: 1px;
  position: sticky;
  margin-left: 89.5px;

  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;

export const WorkflowQuickAddTaskContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  // width: 90%;
  width: ${({ $width }) => $width};
  margin-left: 54.5px;
  margin-top: -1px;
  margin-bottom: 1px;
  position: sticky;
  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
