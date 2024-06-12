import styled from '@mui/styled-engine';
import palette from 'styles/palette';
import isNil from 'ramda/src/isNil';

export const VTask = styled('div')`
  display: flex;
  ${({
    $workflow,
    bgColor,
    virtualListWorkflowOpen,
    isLastTaskOfGroup,
    $template,
    subtaskQuickAddOpen,
    addWorkflowTask,
    subTaskExpanded,
    isLastGroupOfList,
    isNextVirtualTaskItemTypeBundle,
    isTaskTemplate,
  }: any) =>
    $workflow
      ? `
   padding-bottom: ${
     !virtualListWorkflowOpen
       ? ''
       : isLastTaskOfGroup
       ? bgColor
         ? '24px'
         : isLastGroupOfList
         ? '24px'
         : '0px'
       : isNextVirtualTaskItemTypeBundle
       ? '0px'
       : '0px'
   };
  `
      : `
  padding-bottom: ${
    isLastTaskOfGroup
      ? subtaskQuickAddOpen
        ? '0px'
        : subTaskExpanded
        ? '0px'
        : bgColor
        ? '24px'
        : isLastGroupOfList
        ? '24px'
        : '0px'
      : isNextVirtualTaskItemTypeBundle
      ? ''
      : !isTaskTemplate && !subtaskQuickAddOpen && !subTaskExpanded
      ? '2px'
      : '0px'
  };
  `};
  ${({
    $template,
    isLastTaskOfGroup,
    addWorkflowTask,
    subtaskQuickAddOpen,
    subTaskExpanded,
    bgColor,
    isLastGroupOfList,
    isNextVirtualTaskItemTypeBundle,
  }: any) =>
    $template && !isNextVirtualTaskItemTypeBundle
      ? isLastTaskOfGroup
        ? subtaskQuickAddOpen || addWorkflowTask || subTaskExpanded
          ? 'padding-bottom: 0px'
          : bgColor
          ? 'padding-bottom: 24px'
          : isLastGroupOfList
          ? 'padding-bottom: 24px'
          : 'padding-bottom: 0px'
        : subtaskQuickAddOpen || addWorkflowTask || subTaskExpanded
        ? 'padding-bottom: 0px'
        : 'padding-bottom: 10px'
      : ''};
  width: ${({ $width }) => $width};
  border-left: 1px solid rgb(229, 233, 242);
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};

  // ${({ isLastTaskOfGroup }) =>
    isLastTaskOfGroup ? 'padding-bottom:60px' : 'padding-bottom:0px'};
  // padding-bottom: 0px;
  & > * > * > * > * {
    left: ${({ isTaskTemplate }: boolean) =>
      isTaskTemplate ? ' 54px' : '54.5px'};
  }
`;

export const QuickAddContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  ${({ $width }) => (isNil($width) ? '' : `width: ${$width};`)}
  left: 89.5px;
  padding-bottom: ${({ addWorkflowTask, isTaskTemplate }) =>
    addWorkflowTask || isTaskTemplate ? '0px' : '2px'};
  position: sticky;
  ${({ $template }: any) => ($template ? 'margin-bottom: 10px' : '')};
  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;

export const WorkflowQuickAddTaskContainer = styled('div')`
  border-left: 1px solid ${palette.coolGrey3};
  width: ${({ $width }) => $width};
  left: 54.5px;
  margin-top: 1px;
  position: sticky;
  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
