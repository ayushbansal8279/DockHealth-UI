import styled from '@mui/styled-engine';

export const VSubtask = styled('div')`
  position: relative;
  display: flex;
  font-size: 13px;
  line-height: 40px;
  height: 40px;
  border-left: 1px solid rgb(229, 233, 242);
  margin-left: ${({ isWorkflowSubtask, searchValue, isFilterApply }) =>
    isWorkflowSubtask
      ? '105px;'
      : searchValue || isFilterApply
      ? '70px'
      : '106px'};
  margin-bottom: -5px;
  margin-top: -1px;
`;
