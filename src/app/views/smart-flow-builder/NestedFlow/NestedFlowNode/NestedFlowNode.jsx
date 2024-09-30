import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { IconButton, Typography } from '@mui/material';
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
import NestedFlowNodeStyled, { TaskLinks, TaskWrapper } from '../styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { workflowSelector } from '@/app/selectors/workflow-drawer-selectors';

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
        modalLabel : 'Select From List and Group'
      }),
    );
  };

  const handleClose = useCallback((type) => {
    if(type === 'taskList'){
      dispatch(
        partialUpdateTask(taskIdentifier, {
          linkedWorkflowTaskListIdentifier: null,
          ...(taskGroup && {linkedWorkflowTaskGroupIdentifier: null})
        }),
      );
      setTaskList(null);
      setTaskGroup(null);
    }
    else if(type === 'taskGroup'){
      dispatch(
        partialUpdateTask(taskIdentifier, {
          linkedWorkflowTaskGroupIdentifier: null
        }),
      );
      setTaskGroup(null);
    }
  }, [dispatch, taskIdentifier, taskGroup]); 

  const description = task?.description || workflow?.name;

  const memberslist = data?.task?.taskTemplate?.members || [];
  const currentUser = useSelector(userProfileSelector);
  const isCurrentMemberPermission = memberslist?.find(({ user }) => 
    user.identifier === currentUser.identifier)
    ?.memberPermission === 'VIEW';

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskWrapper>
        <TaskNodeWrapper selected={selected} type={type} width={280}>
          <TaskNodeEllipsis />
          <NestedFlowNodeStyled>
            <Typography component="p" style={{ maxHeight: '100%' }}>
              {description?.slice(0, 40)}
              {description?.length > 40 && '...'}
            </Typography>
            { !isCurrentMemberPermission && (
              <IconContainerStyled>
              <IconButton onClick={handleDelete}>
                <Delete htmlColor={palette.white} />
              </IconButton>
              <IconButton onClick={handleOpenModal}>
                <Edit htmlColor={palette.white} />
              </IconButton>
              <IconButton onClick={handleOpenListPicker}>
                <ListsIcon color="white" />
              </IconButton>
            </IconContainerStyled>
             )
            }           
          </NestedFlowNodeStyled>
        </TaskNodeWrapper>
        <TaskLinks>
          {taskList && (
            <Typography
              component="p"
              style={{
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                padding:'5px 0 5px 0'
              }}
            >
            {taskList?.listName.slice(0, 23)}{taskList?.listName.length > 23 && '...'}
            <IconButton
              size="small"
              onClick={() => handleClose('taskList')}
              style={{ padding: '4px', right:7, position: 'absolute' }}
            >
              <CloseIcon htmlColor={palette.white} fontSize='small'/>
             </IconButton>
            </Typography>
          )}
          {taskGroup && (
            <Typography
              component="p"
              style={{
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                paddingBottom:'6px'
              }}
            >
              {taskGroup?.groupName.slice(0, 23)}{taskGroup?.groupName.length > 23 && '...'}
              <IconButton
                size="small"
                onClick={() => handleClose('taskGroup')}
                style={{ padding: '4px' , right: 7 , position: 'absolute'}}
              >
              <CloseIcon htmlColor={palette.white} fontSize='small'/>
             </IconButton>
            </Typography>
          )}
        </TaskLinks>
      </TaskWrapper>
    </TaskNodeHandles>
  );
});

export default NestedFlowNode;
