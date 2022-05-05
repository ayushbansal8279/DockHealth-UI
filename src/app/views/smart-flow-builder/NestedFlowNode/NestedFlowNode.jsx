import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { openModal, closeModal } from 'modal/actions';
import {
  addTaskToTemplate,
  deleteTemporaryElement,
} from 'actions/task-template-actions';
import { getTemplates } from 'api/task-template-api';
import { Edit, Add, Delete } from '@material-ui/icons';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';

import { NestedFlowNodeStyled } from './styled';

const NestedFlowNode = React.memo(props => {
  const { id, type, data, selected, xPos, yPos, isConnectable } = props;
  const [workflow, setWorkflow] = useState({});
  const { taskTemplateIdentifier } = data;

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
    if (Object.keys(workflow).length !== 0) {
      dispatch(
        addTaskToTemplate(
          {
            workflowName: workflow.workflowName,
            taskTemplateIdentifier,
            intentType: 'WORKFLOW_LINK',
          },
          id,
          { x: xPos, y: yPos },
        ),
      );
    }
  }, [dispatch, id, taskTemplateIdentifier, workflow, xPos, yPos]);

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskNodeWrapper selected={selected} type={type}>
        <NestedFlowNodeStyled>
          <IconButton onClick={handleOpenModal}>
            <Add />
          </IconButton>
          <Typography component="p">
            {workflow?.workflowName
              ? workflow.workflowName
              : 'Connect to Smartflow'}
          </Typography>
          <IconButton onClick={() => dispatch(deleteTemporaryElement(id))}>
            <Delete color="secondary" />
          </IconButton>
          {workflow?.workflowName ? (
            <IconButton onClick={handleOpenModal}>
              <Edit />
            </IconButton>
          ) : null}
        </NestedFlowNodeStyled>
      </TaskNodeWrapper>
    </TaskNodeHandles>
  );
});

export default NestedFlowNode;
