import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
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
    subtaskOrder,
    task,
    taskIdentifier,
    taskContainerReference,
    togglePriorityActive,
    userProfile,
  } = initializeNewTaskDrawerHooks({
    headsUpAreaRef,
    statusSelectData,
    isMultiList,
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
    <NewTaskDrawerContainer
      headsUpAreaHeight={headsUpAreaHeight}
      ref={taskContainerReference}
      compact={compact}
      data-name="TaskDrawerContainer"
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
                handleSubmit={handleSubmit}
                addingTaskOrSubtask={addingTaskOrSubtask}
                setNewTaskAttachments={setNewTaskAttachments}
                newTaskAttachments={newTaskAttachments}
              />
            </FormContext>
          </CondensedFormSection>
        </NewTaskDrawerInnerContainer>
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
    </NewTaskDrawerContainer>
  );
};
