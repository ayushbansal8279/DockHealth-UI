import { Button } from '@material-ui/core';
import { deleteTask, duplicateTask } from 'actions/task-actions';
import { onButtonClicked } from 'helpers/ga-event-helper';
import { getPatientName, noop } from 'helpers/utility-functions';
import React, { useState } from 'react';
import { FormContext } from 'react-hook-form';
import { getPriorityColor } from 'styles/palette';
import { getSubscriptionIsTrial } from 'views/self-serve/subscriptions/SubscriptionsView.Utilities';
import TaskDrawerCommentSection from './TaskDrawer.CommentSection';
import initializeTaskDrawerHooks from './TaskDrawer.Hooks';
import onSubmit from './TaskDrawer.OnSubmit';
import TaskDrawerOtherDataSection from './TaskDrawer.OtherDataSection';
import TaskDrawerParentInfo from './TaskDrawer.ParentInfo';
import {
  BottomButtonContainer,
  CondensedFormSection,
  OuterDrawerContainer,
  SideClickListener,
  StyledForm,
  StyledVerticalDivider,
  TaskDrawerContainer,
  TaskDrawerInnerContainer,
} from './TaskDrawer.Styled';
import TaskDrawerTopSection from './TaskDrawer.TopSection';

const statusSelectData = [
  {
    key: 'no-status',
    value: null,
    label: 'No Status',
    color: getPriorityColor(null),
  },
  {
    key: 'in-progress',
    value: 'IN_PROGRESS',
    label: 'In Progress',
    color: getPriorityColor('IN_PROGRESS'),
  },
  {
    key: 'planned',
    value: 'PLANNED',
    label: 'Planned',
    color: getPriorityColor('PLANNED'),
  },
  {
    key: 'on-hold',
    value: 'ON_HOLD',
    label: 'On Hold',
    color: getPriorityColor('ON_HOLD'),
  },
];

const onDelete = ({ afterDelete, dispatch, task }) => async event => {
  event.preventDefault();
  event.stopPropagation();

  if (task) {
    try {
      await deleteTask(task)(dispatch);
      afterDelete();
      onButtonClicked('Delete task');
    } catch {
      noop();
    }
  }
};

const onDuplicate = ({ afterDuplicate, dispatch, task }) => async event => {
  event.preventDefault();
  event.stopPropagation();

  if (task && task.taskIdentifier != null) {
    try {
      const newTask = await duplicateTask(task)(dispatch);
      afterDuplicate({ newTask });
      onButtonClicked('Duplicate task');
    } catch {
      noop();
    }
  }
};

export default ({
  closeDrawer,
  headsUpAreaRef,
  taskList,
  onMarkComplete,
  isInbox,
  isSpecificPatient,
  isMultiList,
  compact = false,
  borderless = false,
}) => {
  const {
    addDeferredCommentToQueue,
    autoSaveVisible,
    closeStatusPopover,
    deferredCommentsPromises,
    dispatch,
    formMethods,
    headsUpAreaHeight,
    openStatusPopover,
    parentTask,
    popoversOpen,
    priorityActive,
    saveTaskPriority,
    setAutoSaveVisible,
    setPopoversOpen,
    setStatus,
    status,
    statusPopoverOpen,
    storeAsCurrentTask,
    subscription,
    subtaskOrder,
    task,
    taskIdentifier,
    taskContainerReference,
    togglePriorityActive,
    userProfile,
  } = initializeTaskDrawerHooks({
    headsUpAreaRef,
    statusSelectData,
    isMultiList,
    isInbox,
  });

  const isSubscriptionTrial = getSubscriptionIsTrial({
    subscription,
  });

  const isSubtask = Boolean(task?.parentTaskIdentifier);

  let defaultValues = {};

  if (task) {
    const patientName = getPatientName(task?.patient);

    defaultValues = {
      ...task,
      assignedToUserIdentifier: task?.assignedTo?.userIdentifier,
      assignedToUserName: task?.assignedTo
        ? task.assignedTo?.userName?.trim()
        : '',
      patient: task?.patient,
      patientIdentifier: task?.patient?.patientIdentifier,
      patientName,
    };
  }

  const contentContainerElement = document.querySelector('#content-container');

  const [newTaskAttachments, setNewTaskAttachments] = useState([]);

  const handleSubmit = formMethods.handleSubmit(
    onSubmit({
      closeDrawer,
      dispatch,
      status,
      task,
      taskList,
      priorityActive,
      storeAsCurrentTask,
      deferredCommentsPromises,
      setAutoSaveVisible,
      newTaskAttachments,
    }),
  );

  const addingTaskOrSubtask = !task || (task && !task.taskIdentifier);

  return (
    <OuterDrawerContainer
      height={Math.min(
        taskContainerReference.current?.clientHeight,
        contentContainerElement?.clientHeight,
      )}
    >
      <TaskDrawerContainer
        headsUpAreaHeight={headsUpAreaHeight}
        ref={taskContainerReference}
        compact={compact}
        data-name="TaskDrawerContainer"
        isSubscriptionTrial={isSubscriptionTrial}
      >
        {parentTask && (
          <TaskDrawerParentInfo
            addingTaskOrSubtask={addingTaskOrSubtask}
            autoSaveVisible={autoSaveVisible}
            closeDrawer={closeDrawer}
            parentTask={parentTask}
            storeAsCurrentTask={storeAsCurrentTask}
            subtaskOrder={subtaskOrder}
          />
        )}
        <StyledForm onSubmit={handleSubmit}>
          <TaskDrawerInnerContainer>
            <TaskDrawerTopSection
              addingTaskOrSubtask={addingTaskOrSubtask}
              autoSaveVisible={autoSaveVisible}
              defaultValues={defaultValues}
              closeDrawer={closeDrawer}
              closeStatusPopover={closeStatusPopover}
              handleSubmit={handleSubmit}
              isInbox={isInbox}
              isSubtask={isSubtask}
              isSpecificPatient={isSpecificPatient}
              formMethods={formMethods}
              parentTask={parentTask}
              onMarkComplete={onMarkComplete}
              openStatusPopover={openStatusPopover}
              priorityActive={priorityActive}
              saveTaskPriority={saveTaskPriority}
              setAutoSaveVisible={setAutoSaveVisible}
              setPopoversOpen={setPopoversOpen}
              setStatus={setStatus}
              status={status}
              statusPopoverOpen={statusPopoverOpen}
              statusSelectData={statusSelectData}
              storeAsCurrentTask={storeAsCurrentTask}
              task={task}
              taskIdentifier={taskIdentifier}
              togglePriorityActive={togglePriorityActive}
              borderless={borderless}
            />
            <CondensedFormSection
              borderless={borderless}
              container
              item
              xs={12}
            >
              {userProfile?.access?.commentsEnabled && (
                <TaskDrawerCommentSection
                  task={task}
                  addDeferredCommentToQueue={addDeferredCommentToQueue}
                />
              )}
              <FormContext {...formMethods}>
                <TaskDrawerOtherDataSection
                  task={task}
                  taskList={taskList}
                  closeDrawer={closeDrawer}
                  setAutoSaveVisible={setAutoSaveVisible}
                  isInbox={isInbox}
                  handleSubmit={handleSubmit}
                  addingTaskOrSubtask={addingTaskOrSubtask}
                  setNewTaskAttachments={setNewTaskAttachments}
                  newTaskAttachments={newTaskAttachments}
                />
              </FormContext>
            </CondensedFormSection>
          </TaskDrawerInnerContainer>
        </StyledForm>
        {task && task.taskIdentifier != null && task.status !== 'COMPLETE' && (
          <BottomButtonContainer>
            <Button
              size="small"
              variant="text"
              onClick={onDelete({
                afterDelete: () => {
                  closeDrawer();
                },
                dispatch,
                task,
              })}
            >
              Delete
            </Button>
            {!parentTask && (
              <>
                <StyledVerticalDivider />
                <Button
                  size="small"
                  variant="text"
                  onClick={onDuplicate({
                    afterDuplicate: ({ newTask }) => {
                      storeAsCurrentTask(newTask);
                    },
                    dispatch,
                    task,
                  })}
                >
                  Duplicate
                </Button>
              </>
            )}
          </BottomButtonContainer>
        )}
        {(!task || !task.taskIdentifier) && (
          <BottomButtonContainer>
            <Button
              size="small"
              variant="text"
              onClick={() => {
                closeDrawer();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={
                popoversOpen.assignedToPopoverOpen ||
                popoversOpen.patientPopoverOpen
              }
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </Button>
          </BottomButtonContainer>
        )}
        {!compact && <SideClickListener onClick={closeDrawer} />}
      </TaskDrawerContainer>
    </OuterDrawerContainer>
  );
};
