import React from 'react';
import { FormContext } from 'react-hook-form';

import { deleteTask, duplicateTask } from '../../actions/task-actions';
import { onButtonClicked } from '../../helpers/ga-event-helper';
import { getPatientName, noop } from '../../helpers/utility-functions';
import NewTaskDrawerCommentSection from './NewTaskDrawer.CommentSection';
import initializeNewTaskDrawerHooks from './NewTaskDrawer.Hooks';
import onSubmit from './NewTaskDrawer.OnSubmit';
import NewTaskDrawerOtherDataSection from './NewTaskDrawer.OtherDataSection';
import NewTaskDrawerParentInfo from './NewTaskDrawer.ParentInfo';
import {
  BottomButtonContainer,
  CondensedFormSection,
  NewTaskDrawerContainer,
  NewTaskDrawerInnerContainer,
  SideClickListener,
  StyledButton,
  StyledForm,
  StyledVerticalDivider,
} from './NewTaskDrawer.Styled';
import NewTaskDrawerTopSection from './NewTaskDrawer.TopSection';

const statusSelectData = [
  {
    key: 'no-status',
    value: null,
    label: 'No Status',
    color: '#808080',
  },
  {
    key: 'in-progress',
    value: 'IN_PROGRESS',
    label: 'In Progress',
    color: '#00a73c',
  },
  {
    key: 'planned',
    value: 'PLANNED',
    label: 'Planned',
    color: '#f6b039',
  },
  {
    key: 'on-hold',
    value: 'ON_HOLD',
    label: 'On Hold',
    color: '#dc143c',
  },
];

const onDelete = ({ afterDelete, dispatch, task }) => async event => {
  event.preventDefault();
  event.stopPropagation();

  if (task) {
    try {
      await deleteTask(task)(dispatch);
      toggleAlert('Task deleted successfully', 'success');
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

  if (task && task.taskId != null) {
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
    priorityActive,
    saveTaskPriority,
    setAutoSaveVisible,
    setStatus,
    status,
    statusPopoverOpen,
    storeAsCurrentTask,
    subtaskOrder,
    task,
    taskId,
    taskContainerReference,
    togglePriorityActive,
    userProfile,
  } = initializeNewTaskDrawerHooks({ headsUpAreaRef, statusSelectData });

  const isSubtask = Boolean(task?.parentTaskId);

  let defaultValues = {};

  if (task) {
    const patientName = getPatientName(task?.patient);

    defaultValues = {
      ...task,
      assignedToUserId: task?.assignedTo?.userId,
      assignedToUserName: task?.assignedTo
        ? task.assignedTo?.userName?.trim()
        : '',
      patient: JSON.stringify(task?.patient),
      patientId: task?.patient?.patientId,
      patientName,
    };
  }

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
    }),
  );

  const addingTaskOrSubtask = !task || (task && !task.taskId);

  return (
    <NewTaskDrawerContainer
      headsUpAreaHeight={headsUpAreaHeight}
      ref={taskContainerReference}
    >
      {parentTask && (
        <NewTaskDrawerParentInfo
          addingTaskOrSubtask={addingTaskOrSubtask}
          autoSaveVisible={autoSaveVisible}
          closeDrawer={closeDrawer}
          parentTask={parentTask}
          storeAsCurrentTask={storeAsCurrentTask}
          subtaskOrder={subtaskOrder}
        />
      )}
      <StyledForm onSubmit={handleSubmit}>
        <NewTaskDrawerInnerContainer>
          <NewTaskDrawerTopSection
            addingTaskOrSubtask={addingTaskOrSubtask}
            autoSaveVisible={autoSaveVisible}
            defaultValues={defaultValues}
            closeDrawer={closeDrawer}
            closeStatusPopover={closeStatusPopover}
            handleSubmit={handleSubmit}
            isInbox={isInbox}
            isSubtask={isSubtask}
            formMethods={formMethods}
            parentTask={parentTask}
            onMarkComplete={onMarkComplete}
            openStatusPopover={openStatusPopover}
            priorityActive={priorityActive}
            saveTaskPriority={saveTaskPriority}
            setAutoSaveVisible={setAutoSaveVisible}
            setStatus={setStatus}
            status={status}
            statusPopoverOpen={statusPopoverOpen}
            statusSelectData={statusSelectData}
            storeAsCurrentTask={storeAsCurrentTask}
            task={task}
            taskId={taskId}
            togglePriorityActive={togglePriorityActive}
          />
          <CondensedFormSection container item xs={12}>
            {userProfile?.access?.commentsEnabled && (
              <NewTaskDrawerCommentSection
                task={task}
                addDeferredCommentToQueue={addDeferredCommentToQueue}
              />
            )}
            <FormContext {...formMethods}>
              <NewTaskDrawerOtherDataSection
                task={task}
                taskList={taskList}
                closeDrawer={closeDrawer}
                setAutoSaveVisible={setAutoSaveVisible}
                isInbox={isInbox}
              />
            </FormContext>
          </CondensedFormSection>
        </NewTaskDrawerInnerContainer>
        {task && task.taskId != null && task.status !== 'COMPLETE' && (
          <BottomButtonContainer>
            <StyledButton
              onClick={onDelete({
                afterDelete: () => {
                  closeDrawer();
                },
                dispatch,
                task,
              })}
            >
              Delete
            </StyledButton>
            <StyledVerticalDivider />
            <StyledButton
              onClick={onDuplicate({
                afterDuplicate: ({ newTask }) => {
                  storeAsCurrentTask(newTask);
                },
                dispatch,
                task,
              })}
            >
              Duplicate
            </StyledButton>
          </BottomButtonContainer>
        )}
        {(!task || !task.taskId) && (
          <BottomButtonContainer>
            <StyledButton
              onClick={() => {
                closeDrawer();
              }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </StyledButton>
          </BottomButtonContainer>
        )}
        <SideClickListener onClick={closeDrawer} />
      </StyledForm>
    </NewTaskDrawerContainer>
  );
};
