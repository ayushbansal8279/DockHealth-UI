import styled from '@mui/styled-engine';
import palette from 'styles/palette';

export const VTask = styled('div')`
  display: flex;
  font-size: 13px;
  ${({
    $workflow,
    virtualListWorkflowOpen,
    isLastTaskOfGroup,
    $template,
    subtaskQuickAddOpen,
    addWorkflowTask,
    subTaskExpanded,
  }: any) =>
    $workflow
      ? `
  height: 48px;
   padding-bottom: ${
     virtualListWorkflowOpen ? (isLastTaskOfGroup ? '80px' : '58px') : ''
   };
  `
      : `
  padding-bottom: ${
    isLastTaskOfGroup
      ? subtaskQuickAddOpen
        ? '0px'
        : subTaskExpanded
        ? '0px'
        : '60px'
      : ''
  };
  height: 36px;
  `};
  ${({
    $template,
    isLastTaskOfGroup,
    addWorkflowTask,
    subtaskQuickAddOpen,
    subTaskExpanded,
  }: any) =>
    $template
      ? isLastTaskOfGroup
        ? subtaskQuickAddOpen || addWorkflowTask || subTaskExpanded
          ? 'padding-bottom: 0px'
          : 'padding-bottom: 60px'
        : subtaskQuickAddOpen || addWorkflowTask || subTaskExpanded
        ? 'padding-bottom: 0px'
        : 'padding-bottom: 45px'
      : ''};

  border-left: 1px solid rgb(229, 233, 242);
  margin-top: -1px;
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};

  // ${({ isLastTaskOfGroup }) =>
    isLastTaskOfGroup ? 'padding-bottom:60px' : 'padding-bottom:0px'};
  // padding-bottom: 0px;
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
  // background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
  ${({ $template }: any) => ($template ? 'margin-bottom: 10px' : '')};
  // padding-bottom: ${({ isLastTaskOfGroup }) =>
    isLastTaskOfGroup ? '60px' : '0px'};
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
