import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { archiveTask as archiveTaskAction } from '../../actions/task-actions';
import { isTaskArchivable as isTaskArchivableMethod } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import CubesLoader from '../common/CubesLoader';
import MemberPicker from '../members/MemberPicker';
import { SubtaskLoadingContainer, SubtaskOrderContainer } from './Task.styled';
import TaskBodyCheckboxContainer from './TaskBody.CheckboxContainer';
import TaskBodyRightDataContainer from './TaskBody.RightDataContainer';
import {
  MemberPickerContainer,
  RolloverNestedListItemText,
  RolloverPopover,
  TaskBodyMainContainer,
} from './TaskBody.styled';
import TaskBodyTaskDescriptionContainer from './TaskBody.TaskDescriptionContainer';
import getTaskBodyData from './TaskBody.Data';

const onTaskBodyMainContainerClick = ({
  readOnly,
  openTaskDrawer,
  markAsUnread,
  storeAsCurrentTask,
  task,
}) => event => {
  event.stopPropagation();
  if (!readOnly) {
    /* eslint-disable no-unused-expressions */
    openTaskDrawer?.();
    storeAsCurrentTask?.(task);
    markAsUnread?.(task, false);
    /* eslint-enable no-unused-expressions */
  }
};

const TaskBody = ({
  isSubtask,
  subtaskIndex,
  task,
  handleStatusChange,
  disabled,
  isParentComplete = task?.status === 'COMPLETE',
  storeAsCurrentTask,
  markAsUnread,
  openTaskDrawer,
  taskDrawerOpen,
  hidePatient,
  hideCheckbox,
  readOnly,
  taskTimeouts,
}) => {
  const {
    createdDateTime,
    updatedDateTime,
    dueDate,
    comments,
    subtasks,
    workflowStatus,
    read,
    updated,
    description,
    creator,
    assignedTo,
    status,
    patient,
    completedDt: completedDateTime,
    completedBy,
    isNewSubtask,
  } = task;

  const isInbox = !task?.taskList?.taskListId;

  const {
    formattedCreationDate,
    formattedDueDate,
    countInfoContent,
    completedByContent,
    formattedUserName,
    overdue,
    members,
  } = getTaskBodyData({
    createdDateTime,
    completedDateTime,
    dueDate,
    subtasks,
    comments,
    creator,
    completedBy,
    isInbox,
  });

  const dispatch = useDispatch();
  const currentUserProfile = useSelector(store => store.userState.userProfile);
  const taskDescriptionReference = useRef(null);
  const taskInnerDescriptionReference = useRef(null);
  const [isPopoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);

  const isTaskArchivable = isTaskArchivableMethod(currentUserProfile, task);

  const isTaskTimingOut =
    status === 'COMPLETE' &&
    Boolean(taskTimeouts?.find(({ taskId }) => taskId === task?.taskId));

  const archiveTask = event => {
    event.preventDefault();
    event.stopPropagation();
    archiveTaskAction(task, currentUserProfile)(dispatch);
  };

  const onTaskDescriptionMouseEnter = useCallback(() => {
    if (
      taskInnerDescriptionReference.current?.scrollWidth >
      taskDescriptionReference.current?.offsetWidth
    ) {
      setPopoverOpen();
    }
  }, [setPopoverOpen]);

  const onTaskDescriptionMouseLeave = useCallback(() => {
    unsetPopoverOpen();
  }, [unsetPopoverOpen]);

  return (
    <TaskBodyMainContainer
      readOnly={readOnly}
      onClick={onTaskBodyMainContainerClick({
        readOnly,
        openTaskDrawer,
        markAsUnread,
        storeAsCurrentTask,
        task,
      })}
    >
      {isSubtask && subtaskIndex && (
        <SubtaskOrderContainer>{`${subtaskIndex}.`}</SubtaskOrderContainer>
      )}
      {isNewSubtask ? (
        <SubtaskLoadingContainer>
          <CubesLoader size={30} />
        </SubtaskLoadingContainer>
      ) : (
        <>
          <TaskBodyCheckboxContainer
            hideCheckbox={hideCheckbox}
            status={status}
            handleStatusChange={handleStatusChange}
            disabled={disabled}
            isSubtask={isSubtask}
            isParentComplete={isParentComplete}
          />
          <MemberPickerContainer>
            <MemberPicker
              task={task}
              member={assignedTo}
              disabled={disabled || isParentComplete || isInbox}
            />
          </MemberPickerContainer>
          <TaskBodyTaskDescriptionContainer
            isSubtask={isSubtask}
            read={read}
            task={task}
            taskDescriptionReference={taskDescriptionReference}
            onTaskDescriptionMouseEnter={onTaskDescriptionMouseEnter}
            onTaskDescriptionMouseLeave={onTaskDescriptionMouseLeave}
            description={description}
            taskInnerDescriptionReference={taskInnerDescriptionReference}
            status={status}
            createdDateTime={createdDateTime}
            updatedDateTime={updatedDateTime}
            updated={updated}
            formattedCreationDate={formattedCreationDate}
            formattedUserName={formattedUserName}
            completedByContent={completedByContent}
            countInfoContent={countInfoContent}
            members={members}
          />
          <TaskBodyRightDataContainer
            taskDrawerOpen={taskDrawerOpen}
            hidePatient={hidePatient}
            patient={patient}
            isSubtask={isSubtask}
            dueDate={dueDate}
            isTaskTimingOut={isTaskTimingOut}
            formattedDueDate={formattedDueDate}
            isTaskArchivable={isTaskArchivable}
            status={status}
            readOnly={readOnly}
            overdue={overdue}
            archiveTask={archiveTask}
            workflowStatus={workflowStatus}
          />
        </>
      )}
      <RolloverPopover
        anchorEl={taskDescriptionReference.current}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        open={isPopoverOpen && !taskDrawerOpen}
        onClose={unsetPopoverOpen}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <RolloverNestedListItemText>
          {description ?? 'Unnamed task'}
          {createdDateTime !== updatedDateTime && ' (edited)'}
        </RolloverNestedListItemText>
      </RolloverPopover>
    </TaskBodyMainContainer>
  );
};

export default TaskBody;
