import React from 'react';
import { FormContext } from 'react-hook-form';

import { deleteTask, duplicateTask } from '../../actions/task-actions';
import { getPatientName, noop } from '../../helpers/utilityFunctions';
import NewTaskDrawerCommentSection from './NewTaskDrawer.commentSection';
import initializeNewTaskDrawerHooks from './NewTaskDrawer.Hooks';
import onSubmit from './NewTaskDrawer.onSubmit';
import NewTaskDrawerOtherDataSection from './NewTaskDrawer.otherDataSection';
import NewTaskDrawerParentInfo from './NewTaskDrawer.ParentInfo';
import {
  BottomButtomContainer,
  CondensedFormSection,
  NewTaskDrawerContainer,
  NewTaskDrawerInnerContainer,
  SideClickListener,
  StyledButton,
  StyledForm,
  StyledVerticalDivider,
} from './NewTaskDrawer.styled';
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
            <NewTaskDrawerCommentSection
              task={task}
              addDeferredCommentToQueue={addDeferredCommentToQueue}
            />
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
          <BottomButtomContainer>
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
          </BottomButtomContainer>
        )}
        {/* If you want to add a button to the Add a task sidebar, do so here.  */}
        <SideClickListener onClick={closeDrawer} />
      </StyledForm>
    </NewTaskDrawerContainer>
  );
};
