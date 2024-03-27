import styled from '@mui/styled-engine';
import palette from 'styles/palette';

export const VTask = styled('div')`
  display: flex;
  font-size: 13px;
  ${({ $workflow, virtualListWorkflowOpen }: any) =>
    $workflow
      ? `
  height: 62px;
  margin-bottom: ${virtualListWorkflowOpen ? '10px' : ''};
  `
      : `
  height: 36px;
  `}
  border-left: 1px solid rgb(229, 233, 242);
  margin-top: -1px;
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
  ${({ $template }: any) => ($template ? 'margin-bottom: 10px' : '')};

  & > * > * > * > * {
    left: ${({ isTaskTemplate }: boolean) =>
      isTaskTemplate ? ' 55.5px' : '54.5px'};
  }
`;

export const QuickAddContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  width: 70%;
  margin-left: 89.5px;
  margin-top: -1px;
  margin-bottom: 1px;

  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;

export const WorkflowQuickAddTaskContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  // width: 90%;
  margin-left: 54.5px;
  margin-top: -1px;
  margin-bottom: 1px;

  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
