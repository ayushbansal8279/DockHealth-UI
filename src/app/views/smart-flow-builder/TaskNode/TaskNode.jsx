/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef, useEffect } from 'react';
import 'reactflow/dist/style.css';
import { useBoolean } from 'hooks/useBoolean';
import SubtaskIcon from 'img/SubtaskIcon';
import { Box, Fab, IconButton, Typography } from '@mui/material';
import { AccountTree as DecisionIcon } from '@mui/icons-material';
import BoltIcon from '@mui/icons-material/Bolt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
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
import { NodeType } from 'helpers/smart-flow-builder-helpers';
import { createMentionsFromTokenizedDescription } from 'components/common/RichTextEditor/CreateMentions';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';
import {
  TaskInfoWrapper,
  TaskDescription,
  TaskDescriptionInput,
  SubtasksLabel,
  DecisionTaskIconWrapper,
  TaskDescriptionWrapper,
  TaskDescriptionInputWrapper,
} from './styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import BaseNode from '../BaseNode/BaseNode';
import { TaskElementIcon } from '../styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

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
    tokenizedDescription,
    taskMentions,
  } = task || {};
  const descriptionInputReference = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing, unsetEditing] = useBoolean(false);
  const dispatch = useDispatch();
  const titles = {
    [NodeType.DECISION]: 'Decision Task',
    [NodeType.STANDARD]: 'Task',
  };

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

  const openTaskDrawer = (filed) => {
    dispatch(openDrawer(filed));
    dispatch(storeAsCurrentTask(task));
  };

  const handleBlur = () => {
    if (inputValue?.length > 0) {
      dispatch(
        partialUpdateTask(taskIdentifier, {
          description: inputValue,
          tokenizedDescription: inputValue,
        }),
      ).then(() => {
        unsetEditing();
      });
    }
  };

  const handleKeyDown = (event) => {
    const { key } = event;

    switch (key) {
      case 'Enter': {
        if (inputValue?.length > 0) {
          descriptionInputReference.current.blur();
        }
        break;
      }
      case 'Escape': {
        unsetEditing();
        break;
      }
      default: {
        break;
      }
    }
  };

  const memberslist = data?.task?.taskTemplate?.members || [];
  const currentUser = useSelector(userProfileSelector);
  const isCurrentMemberPermission =
    memberslist?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'VIEW';

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
      draggedEdgeSourceId={data?.draggedEdgeSourceId}
    >
      <BaseNode
        selected={selected}
        type={type}
        onDoubleClick={setEditing}
        optionButtons={[
          <Fab
            key="delete"
            aria-label="delete"
            size="small"
            onClick={handleDelete}
          >
            <DeleteIcon fontSize="small" color="inherit" />
          </Fab>,
          <Fab key="edit" aria-label="edit" size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" color="inherit" />
          </Fab>,
        ]}
        headerIcon={
          <>
            {type === NodeType.DECISION && <DecisionIcon fontSize="small" />}
            {description.includes('[System]') && type === NodeType.STANDARD && (
              <BoltIcon fontSize="medium" />
            )}
            {type === NodeType.STANDARD &&
              !description.includes('[System]') && <TaskElementIcon />}
          </>
        }
        headerTitle={
          description.includes('[System]')
            ? 'Automation Task'
            : titles[type] || ''
        }
        content={
          <>
            {editing ? (
              <TaskDescriptionInputWrapper>
                <TaskDescriptionInput
                  ref={descriptionInputReference}
                  value={inputValue}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onChange={(event) => setInputValue(event.target?.value || '')}
                />
              </TaskDescriptionInputWrapper>
            ) : (
              <Tooltip
                title={tokenizedDescription}
                key={tokenizedDescription}
                placement="top"
              >
                <TaskDescriptionWrapper>
                  <TaskDescription>
                    {createMentionsFromTokenizedDescription(
                      tokenizedDescription,
                      taskMentions,
                    )}
                  </TaskDescription>
                </TaskDescriptionWrapper>
              </Tooltip>
            )}
          </>
        }
        footerContent={
          <TaskInfoWrapper>
            {!isCurrentMemberPermission && (
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
            )}
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Box p={2} />
              {
                <Box sx={{ paddingRight: '10px' }}>
                  {assignedToUsers?.length === 1 &&
                    (isUserGroup(assignedToUsers[0]) ? (
                      <GroupAvatar group={assignedToUsers[0]} size={30} />
                    ) : (
                      <UserAvatar user={assignedToUsers[0]} size={30} />
                    ))}
                </Box>
              }
              {assignedToUsers?.length > 1 && (
                <AdditionalMembersCounter
                  hiddenMembers={assignedToUsers}
                  size={30}
                />
              )}
            </Box>
          </TaskInfoWrapper>
        }
      />
    </TaskNodeHandles>
  );
});

export default TaskNode;
