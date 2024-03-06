import styled from '@mui/styled-engine';
import palette, { featurePalette, typography } from 'styles/palette';

export const VSubtask = styled('div')`
  position: relative;
  display: flex;
  font-size: 13px;
  line-height: 40px;
  height: 40px;
  border-left: 1px solid rgb(229, 233, 242);
  margin-left: ${({ isWorkflowSubtask }) =>
    isWorkflowSubtask ? '105px;' : '106px'};
  margin-bottom: -5px;
  margin-top: -1px;
`;

export const QuickAddContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  width: 70%;
  margin-left: ${({ isWorkflowSubtask }) =>
    isWorkflowSubtask ? '107px;' : '106px'};

  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
