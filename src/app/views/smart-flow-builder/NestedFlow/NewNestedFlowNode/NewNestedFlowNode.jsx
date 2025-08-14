import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Fab, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { openModal, closeModal } from 'modal/actions';
import {
  addTaskToTemplate,
  deleteTemporaryElement,
} from 'actions/task-template-actions';
import { getTemplates } from 'api/task-template-api';
import { Add, Delete } from '@mui/icons-material';
import palette from 'styles/palette';
import { NodeType } from 'helpers/smart-flow-builder-helpers';
import ListsIcon from 'img/navigation/ListsIcon';
import WorkflowLinkIcon from 'img/template/workflow-icon';
import TaskNodeWrapper from '../../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../../TaskNodeHandles/TaskNodeHandles';
import NestedFlowNodeStyled, {
  DescriptionAndLinksWrapper,
  NewNestedFlowNodeWrapper,
  NewWorkflowDescription,
  TaskLinks,
  TaskWrapper,
} from '../styled';
import BaseNode from '../../BaseNode/BaseNode';
import { DecisionTaskIconWrapper } from '../../TaskNode/styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

const NewNestedFlowNode = React.memo((props) => {
  const { id, type, data, selected, xPos, yPos, isConnectable } = props;
  const [workflow, setWorkflow] = useState({});
  const { taskTemplateIdentifier } = data;
  const [taskList, setTaskList] = useState(null);
  const [taskGroup, setTaskGroup] = useState(null);

  const dispatch = useDispatch();
  const handleOpenModal = () => {
    dispatch(
      openModal('SmartFlowList', {
        fetchMethod: () => getTemplates(true),
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
    if (Object.keys(workflow).length > 0) {
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
      draggedEdgeSourceId={data?.draggedEdgeSourceId}
    >
      <BaseNode
        selected={selected}
        type={type}
        optionButtons={[
          <Fab
            key="delete"
            aria-label="delete"
            size="small"
            onClick={() => dispatch(deleteTemporaryElement(id))}
          >
            <DeleteIcon fontSize="small" color="inherit" />
          </Fab>,
          <Fab
            key="add"
            aria-label="add"
            size="small"
            onClick={handleOpenModal}
          >
            <AddIcon fontSize="medium" color="inherit" />
          </Fab>,
          <Fab
            key="List"
            aria-label="list"
            size="small"
            onClick={handleOpenListPicker}
          >
            <ListsIcon color="black" height="16" width="22" />
          </Fab>,
        ]}
        headerIcon={<WorkflowLinkIcon size={18} />}
        headerTitle={'Workflow Task'}
        content={
          <DescriptionAndLinksWrapper>
            <NewWorkflowDescription>
              {workflow?.workflowName ?? 'Connect to Workflow'}
            </NewWorkflowDescription>
            <TaskLinks>
              {taskList && (
                <Typography
                  component="p"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      gap: '5px',
                      overflow: 'hidden',
                      flexWrap: 'nowrap',
                      fontSize: '14px',
                    }}
                  >
                    <strong>List: </strong>
                    <Tooltip
                      title={taskList?.listName}
                      key={taskList?.listName}
                      placement="top"
                    >
                      <Chip
                        variant="outlined"
                        key={taskList?.listName}
                        label={taskList?.listName}
                        size="small"
                        sx={{
                          maxWidth: 200,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          fontWeight: '600',
                          fontSize: '12px',
                        }}
                      />
                    </Tooltip>
                  </span>
                </Typography>
              )}
              {taskGroup && (
                <Typography
                  component="p"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      gap: '5px',
                      overflow: 'hidden',
                      flexWrap: 'nowrap',
                      fontSize: '14px',
                    }}
                  >
                    <strong>Group:</strong>
                    <Tooltip
                      title={taskGroup?.groupName}
                      key={taskGroup?.groupName}
                      placement="top"
                    >
                      <Chip
                        variant="outlined"
                        key={taskGroup?.groupName}
                        label={taskGroup?.groupName}
                        size="small"
                        sx={{
                          maxWidth: 200,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          fontWeight: '600',
                          fontSize: '12px',
                        }}
                      />
                    </Tooltip>
                  </span>
                </Typography>
              )}
            </TaskLinks>
          </DescriptionAndLinksWrapper>
        }
      />
    </TaskNodeHandles>
  );
});

export default NewNestedFlowNode;
