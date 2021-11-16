/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef, useEffect } from 'react';
import { useBoolean } from 'hooks/useBoolean';
import SubtaskIcon from 'img/SubtaskIcon';
import { Box, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { isUserGroup } from 'helpers/user-helper';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { openModal, closeModal } from 'modal/actions';
import {
  deleteTask,
  partialUpdateTask,
  storeAsCurrentTask,
} from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import AdditionalMembersCounter from 'components/user/AdditionalMembersCounter/AdditionalMembersCounter';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import { NodeType } from 'helpers/task-template-builder-helpers';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';
import {
  OptionsContainer,
  TaskInfoWrapper,
  TaskDescription,
  TaskDescriptionInput,
  ContentWrapper,
  SubtasksLabel,
  DecisionTaskIconWrapper,
} from './styled';

const TaskNode = React.memo(({ data, isConnectable, selected, type }) => {
  const { task } = data || {};
  const {
    taskIdentifier,
    description,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
    comments,
    updatedComment,
    subtasks,
    assignedToUsers,
  } = task || {};
  const descriptionInputReference = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing, unsetEditing] = useBoolean(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editing) {
      setInputValue(description);
      descriptionInputReference.current.focus();
    } else {
      setInputValue('');
    }
  }, [description, editing]);

  const handleDelete = () => {
    const modalProps = {
      isSubtask: !!task.parentTaskIdentifier,
      confirm: () => {
        dispatch(deleteTask(task));
        dispatch(closeModal());
      },
    };

    dispatch(openModal('DeleteTaskConfirmation', modalProps));
  };

  const handleEdit = () => {
    dispatch(storeAsCurrentTask(task));
    dispatch(openDrawer());
  };

  const openTaskDrawer = filed => {
    dispatch(openDrawer(filed));
    dispatch(storeAsCurrentTask(task));
  };

  const handleBlur = () => {
    if (inputValue?.length > 0) {
      dispatch(partialUpdateTask(taskIdentifier, { description: inputValue }));
    }
    unsetEditing();
  };

  const handleKeyDown = event => {
    const { key } = event;

    switch (key) {
      case 'Enter':
        if (inputValue?.length > 0) {
          descriptionInputReference.current.blur();
        }
        break;
      case 'Escape':
        unsetEditing();
        break;
      default:
        break;
    }
  };

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskNodeWrapper selected={selected} type={type}>
        <ContentWrapper onDoubleClick={setEditing}>
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {type === NodeType.DECISION && (
              <DecisionTaskIconWrapper>
                <DecisionTaskElementIcon size={16} />
              </DecisionTaskIconWrapper>
            )}
            <OptionsContainer>
              <IconButton onClick={handleDelete}>
                <DeleteIcon fontSize="small" color="inherit" />
              </IconButton>
              <IconButton onClick={handleEdit}>
                <EditIcon fontSize="small" color="inherit" />
              </IconButton>
            </OptionsContainer>
          </Box>
          <TaskInfoWrapper>
            {editing ? (
              <TaskDescriptionInput
                ref={descriptionInputReference}
                value={inputValue}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onChange={event => setInputValue(event.target?.value || '')}
              />
            ) : (
              <TaskDescription>
                {description.slice(0, 53)}
                {description.length > 53 && '...'}
              </TaskDescription>
            )}
            <Box p={1.2} />
            <Box
              display="flex"
              width="100%"
              height={35}
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Box display="flex">
                <button
                  type="button"
                  onClick={() => openTaskDrawer(DrawerFieldEnum.COMMENT)}
                >
                  <TaskIcon
                    type="comments"
                    isActive={comments?.length > 0}
                    isNew={updatedComment}
                  />
                </button>
                <Box p={1} />
                <button
                  type="button"
                  onClick={() => openTaskDrawer(DrawerFieldEnum.LABEL)}
                >
                  <TaskIcon
                    type="labels"
                    isActive={labels?.length > 0}
                    isNew={updatedLabel}
                  />
                </button>
                <Box p={1} />
                <button
                  type="button"
                  onClick={() => openTaskDrawer(DrawerFieldEnum.ATTACHMENT)}
                >
                  <TaskIcon
                    type="attachments"
                    isActive={attachments?.length > 0}
                    isNew={updatedAttachment}
                  />
                </button>
                <Box px={1} />
                {subtasks?.length > 0 && (
                  <SubtasksLabel>
                    {subtasks.length}
                    <Box px={0.2} />
                    <SubtaskIcon color="currentColor" size={12} />
                  </SubtasksLabel>
                )}
              </Box>
              {assignedToUsers.length === 1 &&
                (isUserGroup(assignedToUsers[0]) ? (
                  <GroupAvatar group={assignedToUsers[0]} size={35} />
                ) : (
                  <UserAvatar user={assignedToUsers[0]} size={35} />
                ))}
              {assignedToUsers.length > 1 && (
                <AdditionalMembersCounter
                  hiddenMembers={assignedToUsers}
                  size={35}
                />
              )}
            </Box>
          </TaskInfoWrapper>
        </ContentWrapper>
      </TaskNodeWrapper>
    </TaskNodeHandles>
  );
});

export default TaskNode;
