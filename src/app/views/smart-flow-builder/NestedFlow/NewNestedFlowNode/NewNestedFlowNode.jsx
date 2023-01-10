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
import ListsIcon from 'img/navigation/ListsIcon';
import TaskNodeWrapper from '../../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../../TaskNodeHandles/TaskNodeHandles';
import NestedFlowNodeStyled, { TaskLinks, TaskWrapper } from '../styled';

const NewNestedFlowNode = React.memo(props => {
  const { id, type, data, selected, xPos, yPos, isConnectable } = props;
  const [workflow, setWorkflow] = useState({});
  const { taskTemplateIdentifier } = data;
  const [taskList, setTaskList] = useState(null);
  const [taskGroup, setTaskGroup] = useState(null);

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

  const handleOpenListPicker = () => {
    dispatch(
      openModal('SelectTaskDestination', {
        fetchMethod: () => Promise.resolve(),
        confirm: ({
          taskListIdentifier,
          listName,
          taskGroupIdentifier,
          groupName,
        }) => {
          // console.log(listName, groupName);
          if (taskListIdentifier) {
            setTaskList({ taskListIdentifier, listName });
          }
          if (taskGroupIdentifier) {
            setTaskGroup({ taskGroupIdentifier, groupName });
          }
        },
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
            intentType: NodeType.WORKFLOW_LINK,
            linkedTemplateIdentifier: workflow.identifier,
            linkedWorkflowTaskListIdentifier: taskList?.taskListIdentifier,
            linkedWorkflowTaskGroupIdentifier: taskGroup?.taskGroupIdentifier,
          },
          id,
          { x: xPos, y: yPos },
        ),
      );
    }
  }, [
    dispatch,
    id,
    taskGroup,
    taskList,
    taskTemplateIdentifier,
    workflow,
    xPos,
    yPos,
  ]);

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskWrapper>
        <TaskNodeWrapper selected={selected} type={type} width={280}>
          <NestedFlowNodeStyled>
            <Typography component="p">
              {workflow?.workflowName
                ? workflow.workflowName
                : 'Connect to Workflow'}
            </Typography>
            <IconButton onClick={() => dispatch(deleteTemporaryElement(id))}>
              <Delete htmlColor={palette.white} />
            </IconButton>
            <IconButton onClick={handleOpenModal}>
              <Add htmlColor={palette.white} />
            </IconButton>
            <IconButton onClick={handleOpenListPicker}>
              <ListsIcon color="white" />
            </IconButton>
          </NestedFlowNodeStyled>
        </TaskNodeWrapper>
        <TaskLinks>
          {taskList && (
            <Typography
              component="p"
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {taskList.listName}
            </Typography>
          )}
          {taskGroup && (
            <Typography
              component="p"
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {taskGroup.groupName}
            </Typography>
          )}
        </TaskLinks>
      </TaskWrapper>
    </TaskNodeHandles>
  );
});

export default NewNestedFlowNode;
