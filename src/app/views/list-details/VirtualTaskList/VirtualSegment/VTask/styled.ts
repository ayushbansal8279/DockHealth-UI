import styled from '@mui/styled-engine';
import palette from 'styles/palette';
import isNil from 'ramda/src/isNil';

export const VTask = styled('div')`
  display: flex;
  font-size: 13px;
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
  }: any) =>
    $workflow
      ? `
  height: 48px;
   padding-bottom: ${
     !virtualListWorkflowOpen
       ? ''
       : isLastTaskOfGroup
       ? bgColor
         ? '72px'
         : isLastGroupOfList
         ? '72px'
         : '0px'
       : isNextVirtualTaskItemTypeBundle
       ? ''
       : '58px'
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
        ? '60px'
        : isLastGroupOfList
        ? '60px'
        : '0px'
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
    bgColor,
    isLastGroupOfList,
    isNextVirtualTaskItemTypeBundle,
  }: any) =>
    $template && !isNextVirtualTaskItemTypeBundle
      ? isLastTaskOfGroup
        ? subtaskQuickAddOpen || addWorkflowTask || subTaskExpanded
          ? 'padding-bottom: 0px'
          : bgColor
          ? 'padding-bottom: 60px'
          : isLastGroupOfList
          ? 'padding-bottom: 60px'
          : 'padding-bottom: 0px'
        : subtaskQuickAddOpen || addWorkflowTask || subTaskExpanded
        ? 'padding-bottom: 0px'
        : 'padding-bottom: 45px'
      : ''};
  width: ${({ $width }) => $width};
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
  ${({ $width }) => (isNil($width) ? '' : `width: ${$width};`)}
  left: 89.5px;
  margin-top: -1px;
  margin-bottom: 1px;
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
  margin-top: -1px;
  margin-bottom: 1px;
  position: sticky;
  &:hover {
    border-left: 1px solid ${palette.coolGrey2};
  }
`;
