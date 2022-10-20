import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { openModal, closeModal } from 'modal/actions';
import { deleteTask, partialUpdateTask } from 'actions/task-actions';
import { getTemplates } from 'api/task-template-api';
import { Edit, Delete, FindReplace } from '@material-ui/icons';
import palette from 'styles/palette';

import TaskNodeHandles from 'views/smart-flow-builder/TaskNodeHandles/TaskNodeHandles';
import TaskNodeWrapper from 'views/smart-flow-builder/TaskNodeWrapper/TaskNodeWrapper';
import { IconContainerStyled } from './styled';
import NestedFlowNodeStyled from '../styled';

const NestedFlowNode = React.memo(({ data, isConnectable, selected, type }) => {
  const { task } = data || {};
  const { taskIdentifier, linkedTaskTemplate } = task || {};

  const [currentWorkflow, setCurrentWorkflow] = useState({
    name: linkedTaskTemplate?.name,
    identifier: linkedTaskTemplate?.identifier,
  });

  const [workflow, setWorkflow] = useState({
    name: linkedTaskTemplate?.name,
    identifier: linkedTaskTemplate?.identifier,
  });
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(
      openModal('SmartFlowList', {
        fetchMethod: () => getTemplates(),
        closeModal,
        setWorkflow,
      }),
    );
  };
  useEffect(() => {
    if (!shallowEqual(workflow, currentWorkflow)) {
      dispatch(
        partialUpdateTask(taskIdentifier, {
          description: workflow.workflowName,
          linkedTemplateIdentifier: workflow.identifier,
        }),
      );
      setCurrentWorkflow(workflow);
    }
  }, [workflow, dispatch, taskIdentifier, currentWorkflow]);

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

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskNodeWrapper selected={selected} type={type}>
        <NestedFlowNodeStyled>
          <Typography component="p">{task.description}</Typography>
          <IconContainerStyled>
            <IconButton onClick={handleDelete}>
              <Delete htmlColor={palette.white} />
            </IconButton>
            <IconButton onClick={handleOpenModal}>
              <Edit htmlColor={palette.white} />
            </IconButton>
          </IconContainerStyled>
        </NestedFlowNodeStyled>
      </TaskNodeWrapper>
    </TaskNodeHandles>
  );
});

export default NestedFlowNode;
