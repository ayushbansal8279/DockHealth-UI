import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { openModal, closeModal } from 'modal/actions';
import { deleteTask, storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';
import {
  OptionsContainer,
  TaskInfoWrapper,
  TaskDescription,
  ContentWrapper,
  SubtasksLabel,
} from './styled';

const TaskNode = React.memo(({ data, isConnectable, selected, type }) => {
  const { task } = data || {};
  const {
    description,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
    comments,
    updatedComment,
    subtasks,
  } = task || {};
  const dispatch = useDispatch();

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

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskNodeWrapper selected={selected} type={type}>
        <ContentWrapper>
          <OptionsContainer>
            <IconButton onClick={handleDelete}>
              <DeleteIcon fontSize="small" color="inherit" />
            </IconButton>
            <IconButton onClick={handleEdit}>
              <EditIcon fontSize="small" color="inherit" />
            </IconButton>
          </OptionsContainer>
          <TaskInfoWrapper>
            <TaskDescription>
              {description.slice(0, 53)}
              {description.length > 53 && '...'}
            </TaskDescription>
            <Box p={1.2} />
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex">
                <TaskIcon
                  type="comments"
                  isActive={comments?.length > 0}
                  isNew={updatedComment}
                  onClick={() => openTaskDrawer(DrawerFieldEnum.COMMENT)}
                />
                <Box p={1} />
                <TaskIcon
                  type="labels"
                  isActive={labels?.length > 0}
                  isNew={updatedLabel}
                  onClick={() => openTaskDrawer(DrawerFieldEnum.LABEL)}
                />
                <Box p={1} />
                <TaskIcon
                  type="attachments"
                  isActive={attachments?.length > 0}
                  isNew={updatedAttachment}
                  onClick={() => openTaskDrawer(DrawerFieldEnum.ATTACHMENT)}
                />
              </Box>
              {subtasks?.length > 0 && (
                <SubtasksLabel>{subtasks.length} Subtasks</SubtasksLabel>
              )}
            </Box>
          </TaskInfoWrapper>
        </ContentWrapper>
      </TaskNodeWrapper>
    </TaskNodeHandles>
  );
});

export default TaskNode;
