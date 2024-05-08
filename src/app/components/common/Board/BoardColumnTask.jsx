import React, { useCallback } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Draggable } from 'react-beautiful-dnd';
import { trunc } from 'helpers/utility-functions';
import { Box, IconButton } from '@mui/material';
import TaskItemIcons from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemIcons';
import { useDispatch, useSelector } from 'react-redux';
import TaskItemDueDate from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemDueDate';
import TaskItemSubtasks from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemSubtasks';
import TaskItemMembers from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemMembers';
import { userProfileSelector } from 'selectors/user-selectors';
import { taskLookupSelector } from 'selectors/task-details-selectors';
import { partialUpdateTask, storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import { openDrawer as openWorkflowDrawer } from 'actions/workflow-drawer-actions';
import TaskItemPatient from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemPatient';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import pluck from 'ramda/src/pluck';
import { log } from 'helpers/log';
import {
  TaskContainer,
  Header,
  OptionsContainer,
  TaskName,
  TaskActionsContainer,
  WorkflowIndicator,
  WorkflowActionsContainer,
} from './styled';

const BoardColumnTask = ({
  task: taskItemIdentifier,
  index,
  taskContextMenuOptions,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);

  const task = useSelector((state) => {
    return taskLookupSelector(state, origin, taskItemIdentifier);
  });

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
    patient,
  } = task;
  const { matchAssignedTo, matchAttachments, matchComments, matchLabels } =
    searchMetaData;

  const isWorkflow = itemType === 'BUNDLE';
  const title = isWorkflow ? name : description;

  // const { patientName } = patient;
  log(`patient name: ${JSON.stringify(patient)}`);

  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

  const { READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

  const handleReasignTask = useCallback(
    (selectedMembers) => {
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
      {(dragProvided) => (
        <Box>
          <TaskContainer
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
          >
            <Header>
              <TaskName onClick={handleOpenDrawer}>{trunc(title, 50)}</TaskName>
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
                <Box flex="1">
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
                  <TaskItemDueDate
                    task={task}
                    format="MM/DD"
                    showTime={false}
                    showRecurring={false}
                  />
                </Box>
                <Box
                  flex="1"
                  display="flex"
                  justifyContent="center"
                  padding="0 2px"
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
            {isWorkflow && (
              <>
                <div>
                  <WorkflowIndicator>workflow</WorkflowIndicator>
                </div>
                <WorkflowActionsContainer>
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
                    <TaskItemDueDate
                      task={task}
                      format="MM/DD"
                      showTime={false}
                      showRecurring={false}
                    />
                  </Box>
                  <Box
                    flex="1"
                    display="flex"
                    justifyContent="center"
                    padding="0 2px"
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
                </WorkflowActionsContainer>
              </>
            )}
            <TaskItemPatient
              // highlightedValue={highlightedValue}
              taskStatus={task?.status}
              isSubtask={false}
              parentHasPatient
              hasParentTaskLabel={false}
              matchPatientMRN={false}
              patient={patient}
              // matchPatient={matchPatient}
              task={task}
              // openPatientPopover={openPatientPopover}
              // onTaskUpdate={onTaskUpdate}
              currentUser={currentUser}
              readOnly={restrictions?.patient === READ_ONLY}
            />
            {/* {isWorkflow && <WorkflowIndicator>workflow</WorkflowIndicator>} */}
          </TaskContainer>
        </Box>
      )}
    </Draggable>
  );
};

export default BoardColumnTask;
