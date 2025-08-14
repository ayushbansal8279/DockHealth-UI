import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Chip, Fab, IconButton, Typography } from '@mui/material';
import { openModal, closeModal } from 'modal/actions';
import { deleteTask, partialUpdateTask } from 'actions/task-actions';
import { getTemplates } from 'api/task-template-api';
import { Edit, Delete } from '@mui/icons-material';
import palette from 'styles/palette';
import ListsIcon from 'img/navigation/ListsIcon';
import CloseIcon from '@mui/icons-material/Close';
import TaskNodeHandles from 'views/smart-flow-builder/TaskNodeHandles/TaskNodeHandles';
import TaskNodeWrapper from 'views/smart-flow-builder/TaskNodeWrapper/TaskNodeWrapper';
import { TaskNodeEllipsis } from 'views/smart-flow-builder/TaskNodeWrapper/styled';
import { IconContainerStyled } from './styled';
import NestedFlowNodeStyled, {
  DescriptionAndLinksWrapper,
  TaskLinks,
  TaskWrapper,
  WorkflowDescription,
} from '../styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { workflowSelector } from '@/app/selectors/workflow-drawer-selectors';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import BaseNode from '../../BaseNode/BaseNode';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditIcon } from '@/app/components/profile-builder/SelectedField/styled';
import WorkflowLinkIcon from 'img/template/workflow-icon';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

const NestedFlowNode = React.memo(({ data, isConnectable, selected, type }) => {
  const { task } = data || {};
  const {
    taskIdentifier,
    linkedTaskTemplate,
    linkedWorkflowTaskList,
    linkedWorkflowTaskGroup,
  } = task || {};

  const [taskList, setTaskList] = useState(linkedWorkflowTaskList);
  const [taskGroup, setTaskGroup] = useState(linkedWorkflowTaskGroup);

  const selectedWorkflow = useSelector(workflowSelector);
  const [currentTaskList, setCurrentTaskList] = useState(
    linkedWorkflowTaskList,
  );
  const [currentTaskGroup, setCurrentTaskGroup] = useState(
    linkedWorkflowTaskGroup,
  );

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
        fetchMethod: () => getTemplates(true),
        closeModal,
        setWorkflow,
      }),
    );
  };
  useEffect(() => {
    if (
      !shallowEqual(workflow, currentWorkflow) ||
      !shallowEqual(taskList, currentTaskList) ||
      !shallowEqual(taskGroup, currentTaskGroup)
    ) {
      dispatch(
        partialUpdateTask(taskIdentifier, {
          description: workflow.workflowName,
          linkedTemplateIdentifier: workflow.identifier,
          linkedWorkflowTaskListIdentifier: taskList?.taskListIdentifier,
          linkedWorkflowTaskGroupIdentifier: taskGroup?.taskGroupIdentifier,
        }),
      );
      setCurrentWorkflow(workflow);
      setCurrentTaskList(taskList);
      setCurrentTaskGroup(taskGroup);
    }
  }, [
    workflow,
    dispatch,
    taskIdentifier,
    currentWorkflow,
    taskList,
    currentTaskList,
    taskGroup,
    currentTaskGroup,
  ]);

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
          } else {
            setTaskList(null);
          }
          if (taskGroupIdentifier) {
            setTaskGroup({ taskGroupIdentifier, groupName });
          } else {
            setTaskGroup(null);
          }
        },
        modalLabel: 'Select List and Group',
        origin: TaskOrigin.TEMPLATE,
      }),
    );
  };

  const handleClose = useCallback(
    (type) => {
      if (type === 'taskList') {
        dispatch(
          partialUpdateTask(taskIdentifier, {
            linkedWorkflowTaskListIdentifier: null,
            ...(taskGroup && { linkedWorkflowTaskGroupIdentifier: null }),
          }),
        );
        setTaskList(null);
        setTaskGroup(null);
      } else if (type === 'taskGroup') {
        dispatch(
          partialUpdateTask(taskIdentifier, {
            linkedWorkflowTaskGroupIdentifier: null,
          }),
        );
        setTaskGroup(null);
      }
    },
    [dispatch, taskIdentifier, taskGroup],
  );

  const description = task?.linkedTaskTemplate?.name || workflow?.name;
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
        optionButtons={
          !isCurrentMemberPermission && [
            <Fab
              key="delete"
              aria-label="delete"
              size="small"
              onClick={handleDelete}
            >
              <DeleteIcon fontSize="small" color="inherit" />
            </Fab>,
            <Fab
              key="edit"
              aria-label="edit"
              size="small"
              onClick={handleOpenModal}
            >
              <EditIcon fontSize="small" color="inherit" />
            </Fab>,
            <Fab
              key="List"
              aria-label="list"
              size="small"
              onClick={handleOpenListPicker}
            >
              <ListsIcon color="black" height="16" width="22" />
            </Fab>,
          ]
        }
        headerTitle={'Workflow Task'}
        headerIcon={<WorkflowLinkIcon size={18} />}
        content={
          <DescriptionAndLinksWrapper>
            <Tooltip title={description} key={description} placement="top">
              <WorkflowDescription>{description}</WorkflowDescription>
            </Tooltip>
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
                        onDelete={() => handleClose('taskList')}
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
                        onDelete={() => handleClose('taskGroup')}
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

export default NestedFlowNode;
