import styled from '@mui/styled-engine';

export const VSubtask = styled('div')`
  position: relative;
  display: flex;
  font-size: 13px;
  line-height: 40px;
  height: 35px;
  border-left: 1px solid rgb(229, 233, 242);
  margin-left: ${({ isWorkflowSubtask, searchValue, isFilterApply }) =>
    isWorkflowSubtask
      ? '89.5px'
      : searchValue || isFilterApply
      ? '54.5px'
      : '90.5px'};
  // margin-bottom: -5px;
  // margin-top: -1px;
  // margin-bottom: -5px;
  margin-top: -0.8x;
  background: ${({ bgColor }) => (bgColor ? '#eff6fb' : '')};
`;
