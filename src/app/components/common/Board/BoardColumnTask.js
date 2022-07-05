import React, { useCallback } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Draggable } from 'react-beautiful-dnd';
import { Box, IconButton } from '@material-ui/core';
import TaskItemIcons from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemIcons';
import { useDispatch, useSelector } from 'react-redux';
import TaskItemDueDate from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemDueDate';
import TaskItemSubtasks from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemSubtasks';
import TaskItemMembers from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemMembers';
import { userProfileSelector } from 'selectors/user-selectors';
import { partialUpdateTask, storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import { openDrawer as openWorkflowDrawer } from 'actions/workflow-drawer-actions';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import { pluck } from 'ramda';
import {
  TaskContainer,
  Header,
  OptionsContainer,
  TaskName,
  TaskActionsContainer,
  WorkflowIndicator,
} from './styled';

const BoardColumnTask = ({ task, index, taskContextMenuOptions }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const {
    identifier,
    description,
    searchMetaData = {},
    comments,
    labels,
    attachments,
    subtaskQuickAddOpen,
    subTasksCount,
    assignedToUsers,
    itemType,
    name,
  } = task;
  const {
    matchAssignedTo,
    matchAttachments,
    matchComments,
    matchLabels,
  } = searchMetaData;

  const isWorkflow = itemType === 'BUNDLE';

  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

  const { READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

  const handleReasignTask = useCallback(
    selectedMembers => {
      partialUpdateTask(identifier, {
        assignedToUsers: selectedMembers,
        assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
        assignedBy: selectedMembers?.length ? currentUser : null,
      });
    },
    [currentUser, identifier],
  );

  const handleOpenDrawer = useCallback(() => {
    if (isWorkflow) {
      dispatch(openWorkflowDrawer(identifier, task));
    } else {
      dispatch(storeAsCurrentTask(task));
      dispatch(openDrawer());
    }
  }, [dispatch, identifier, isWorkflow, task]);

  return (
    <Draggable
      key={identifier}
      draggableId={identifier}
      index={index}
      shouldRespectForceTouch={false}
    >
      {dragProvided => (
        <Box>
          <TaskContainer
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
          >
            <Header>
              <TaskName onClick={handleOpenDrawer}>
                {isWorkflow ? name : description}
              </TaskName>
              {!isWorkflow && (
                <OptionsContainer>
                  {taskContextMenuOptions?.length && (
                    <OptionsMenu
                      options={taskContextMenuOptions}
                      customButtonComponent={IconButton}
                    >
                      <MoreVertIcon />
                    </OptionsMenu>
                  )}
                </OptionsContainer>
              )}
            </Header>
            {!isWorkflow && (
              <TaskActionsContainer>
                <Box flex="3">
                  <TaskItemIcons
                    restrictions={restrictions}
                    matchComments={matchComments}
                    comments={comments}
                    task={task}
                    matchLabels={matchLabels}
                    labels={labels}
                    matchAttachments={matchAttachments}
                    attachments={attachments}
                    dispatch={dispatch}
                  />
                </Box>
                <Box flex="1" display="flex" justifyContent="center">
                  <TaskItemDueDate task={task} />
                </Box>
                <Box
                  flex="1"
                  display="flex"
                  justifyContent="center"
                  padding="0 10px"
                >
                  <TaskItemSubtasks
                    subtaskQuickAddOpen={subtaskQuickAddOpen}
                    subtasksDisabled
                    subTasksCount={subTasksCount || '0'}
                    taskIdentifier={identifier}
                    dispatch={dispatch}
                    readOnly={restrictions?.subtasks === READ_ONLY}
                  />
                </Box>
                <Box flex="1" display="flex" justifyContent="center">
                  <TaskItemMembers
                    readOnly={restrictions?.assigment === READ_ONLY}
                    task={task}
                    assignedToUsers={assignedToUsers}
                    handleReasignTask={handleReasignTask}
                    matchAssignedTo={matchAssignedTo}
                  />
                </Box>
              </TaskActionsContainer>
            )}
            {isWorkflow && <WorkflowIndicator>workflow</WorkflowIndicator>}
          </TaskContainer>
        </Box>
      )}
    </Draggable>
  );
};

export default BoardColumnTask;
