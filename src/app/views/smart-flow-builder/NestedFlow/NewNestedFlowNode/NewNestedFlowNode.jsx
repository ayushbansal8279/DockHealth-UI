import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { openModal, closeModal } from 'modal/actions';
import {
  addTaskToTemplate,
  deleteTemporaryElement,
} from 'actions/task-template-actions';
import { getTemplates } from 'api/task-template-api';
import { Add, Delete } from '@material-ui/icons';
import palette from 'styles/palette';
import { NodeType } from 'helpers/smart-flow-builder-helpers';
import TaskNodeWrapper from '../../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../../TaskNodeHandles/TaskNodeHandles';
import NestedFlowNodeStyled from '../styled';

const NewNestedFlowNode = React.memo(props => {
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
            description: workflow.workflowName,
            taskTemplateIdentifier,
            linkedTemplateIdentifier: workflow.identifier,
            intentType: NodeType.WORKFLOW_LINK,
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
            <Add htmlColor={palette.white} />
          </IconButton>
          <Typography component="p">
            {workflow?.workflowName
              ? workflow.workflowName
              : 'Connect to Workflow'}
          </Typography>
          <IconButton onClick={() => dispatch(deleteTemporaryElement(id))}>
            <Delete htmlColor={palette.white} />
          </IconButton>
        </NestedFlowNodeStyled>
      </TaskNodeWrapper>
    </TaskNodeHandles>
  );
});

export default NewNestedFlowNode;
