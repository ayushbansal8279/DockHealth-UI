import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import head from 'ramda/es/head';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import moment from 'moment';
import {
  saveTask,
  assignOrReassignTask,
  updatePatient,
  deleteTask,
  moveTask,
  storeAsCurrentTask as storeAsCurrentTaskAction,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import { PriorityDot } from '../common/Priority';
import NewTaskDrawerForm from './NewTaskDrawer.form';
import PriorityFlag from './PriorityFlag';
import { noop, getPatientName } from '../../helpers/utilityFunctions';
import { getAllPatients } from '../../actions/patient-actions';
import { CloseTaskButton } from './TaskDrawerButtons';
import NewTaskDrawerCommentSection from './NewTaskDrawer.commentSection';
import NewTaskDrawerOtherDataSection from './NewTaskDrawer.otherDataSection';

const NewTaskDrawerContainer = styled.div`
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  flex: 1.4;
  height: calc(100vh - 5.5rem);
  justify-content: flex-start;
  padding: 0 0.25rem;
  position: sticky;
  transition: all 0.25s ease-out;
  top: 6.25rem;
`;

const TopLabel = styled.div`
  color: #000;
  font-size: 24px;
  line-height: 44px;
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  padding-top: 0.75rem;
`;

const FormSectionNoBorder = styled(Grid)`
  margin-top: 5px;
  padding: 0 8px 8px;

  &:not(:first-child) {
    margin-top: 8px;
  }
`;

const FormSectionDivider = styled.div`
  background-color: #ddf2f7;
  height: 2px;
  width: 100%;

  ${props => props.condensed && 'margin: 0 0.5rem;'}
`;

const FormSection = styled(FormSectionNoBorder)`
  background-color: #fff;
  border: 2px solid #ddf2f7;
`;

const CondensedFormSection = styled(FormSection)`
  padding: 0;
`;

const StatusSelect = styled.div`
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  flex-flow: row nowrap;

  & > * {
    font-size: 14px;
    margin-left: 6px;
  }
`;

const CloseTaskButtonContainer = styled.div`
  padding-right: 0.5rem;
`;

const StyledButton = styled(Button)`
  && {
    ${props => props.variant === 'contained' && 'background-color: #007cab;'}
    box-shadow: none;
    color: ${props => (props.variant === 'contained' ? '#fff' : '#009fcd')};
    font-size: ${props => (props.variant === 'contained' ? 1 : 0.875)}rem;
    ${props => props.variant === 'contained' && 'font-weight: bold;'}
    margin: 1.5rem 0.25rem;
    text-transform: none;
  }
`;

const StyledForm = styled.form`
  overflow-y: auto;
  margin-right -1rem;
  padding-right: 1rem;
`;

const statusSelectData = [
  {
    key: 'no-status',
    value: null,
    label: 'No Status',
    color: '#808080',
  },
  {
    key: 'in-progress',
    value: 'IN_PROGRESS',
    label: 'In Progress',
    color: '#00a73c',
  },
  {
    key: 'planned',
    value: 'PLANNED',
    label: 'Planned',
    color: '#f6b039',
  },
  {
    key: 'on-hold',
    value: 'ON_HOLD',
    label: 'On Hold',
    color: '#dc143c',
  },
];

const renderStatusSelectOption = ({
  closeStatusPopover,
  setStatus,
}) => status => {
  const { key, label, color } = status;

  return (
    <ListItem
      key={key}
      button
      onClick={() => {
        setStatus(status);
        closeStatusPopover();
      }}
    >
      <ListItemIcon>
        <PriorityDot color={color} />
      </ListItemIcon>
      <ListItemText>
        <span>{label}</span>
      </ListItemText>
    </ListItem>
  );
};

const onSubmit = ({
  dispatch,
  status,
  task,
  taskList,
  priorityActive,
  storeAsCurrentTask,
}) => async data => {
  const {
    assignedToUserId,
    patientId,
    patient: unusedPatient,
    newTaskListId,
    newTaskDueDate,
    ...newData
  } = data;
  let { patient } = data;

  let currTaskListId = 0;
  if (taskList && taskList.taskListId) {
    currTaskListId = taskList.taskListId;
  }

  const requestData = {
    ...task,
    ...newData,
    taskListId: currTaskListId,
    workflowStatus: status.value,
    priority: priorityActive ? 'HIGH' : 'LOW',
    assignedToId: assignedToUserId,
    patientId,
  };

  if (newTaskDueDate && moment(newTaskDueDate).isValid()) {
    requestData.dueDate = newTaskDueDate;
  }

  try {
    patient = JSON.parse(patient);
  } catch {
    noop();
  }

  try {
    const newTask = await saveTask(requestData)(dispatch);
    await Promise.all([
      assignOrReassignTask(newTask, assignedToUserId || -1)(dispatch),
      updatePatient(newTask, patient)(dispatch),
    ]);

    if (newTaskListId) {
      await moveTask(newTask, { taskListId: newTaskListId })(dispatch);
    }

    if (!requestData.taskId) {
      storeAsCurrentTask({ ...newTask, ...requestData });
    }
  } catch {
    noop();
  }
};

const onDelete = ({ afterDelete, dispatch, task }) => async () => {
  if (task) {
    try {
      await deleteTask(task)(dispatch);
      afterDelete();
    } catch {
      noop();
    }
  }
};

const thresholds = [];

for (let threshold = 0; threshold <= 1; threshold += 0.02) {
  thresholds.push(threshold);
}

const intersectionCallback = entries => {
  entries.forEach(({ intersectionRect: { height }, target }) => {
    const form = target.querySelector('form');

    if (form) {
      form.style.height = height;
      form.style.minHeight = height;
    }
  });
};

let observer;
try {
  observer = new IntersectionObserver(intersectionCallback, {
    root: null,
    rootMargin: '0px',
    threshold: thresholds,
  });
} catch {
  observer = {
    observe: () => {},
    unobserve: () => {},
  };
}

export default ({ closeDrawer, headsUpAreaRef, taskList, onMarkComplete }) => {
  const [
    priorityActive,
    setPriorityActive,
    unsetPriorityActive,
    togglePriorityActive,
  ] = useBoolean(false);
  const [statusPopoverOpen, openStatusPopover, closeStatusPopover] = useBoolean(
    false,
  );
  const [status, setStatus] = useState(head(statusSelectData));
  const [headsUpAreaHeight, setHeadsUpAreaHeight] = useState(0);
  const statusSelectRef = useRef(null);
  const task = useSelector(store => store.taskState.selectedTask);
  const dispatch = useDispatch();
  const taskContainerRef = useRef(null);

  const storeAsCurrentTask = useCallback(
    newTask => storeAsCurrentTaskAction(newTask)(dispatch),
    [dispatch],
  );

  const isSubtask = Boolean(task?.parentTaskId);

  const formMethods = useForm({});

  useEffect(() => {
    getAllPatients()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isPriorityHigh = task?.priority === 'HIGH';

    if (isPriorityHigh) {
      setPriorityActive();
    } else {
      unsetPriorityActive();
    }

    const newWorkflowStatus = statusSelectData.find(
      ({ value }) => value === task?.workflowStatus,
    );

    if (newWorkflowStatus) {
      setStatus(newWorkflowStatus);
    }
  }, [setPriorityActive, task, unsetPriorityActive]);

  useEffect(
    () => {
      setHeadsUpAreaHeight(headsUpAreaRef?.scrollHeight ?? 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [headsUpAreaRef?.scrollHeight],
  );

  useEffect(() => {
    if (taskContainerRef.current) {
      observer.observe(taskContainerRef.current);

      return () => {
        observer.unobserve(taskContainerRef.current);
      };
    }
  }, []);

  let defaultValues = {};

  if (task) {
    const patientName = getPatientName(task?.patient);

    defaultValues = {
      ...task,
      assignedToUserId: task?.assignedTo?.userId,
      assignedToUserName: task?.assignedTo
        ? task.assignedTo?.userName?.trim()
        : '',
      patient: JSON.stringify(task?.patient),
      patientId: task?.patient?.patientId,
      patientName,
    };
  }

  const handleSubmit = formMethods.handleSubmit(
    onSubmit({
      closeDrawer,
      dispatch,
      status,
      task,
      taskList,
      priorityActive,
      storeAsCurrentTask,
    }),
  );

  return (
    <NewTaskDrawerContainer
      headsUpAreaHeight={headsUpAreaHeight}
      ref={taskContainerRef}
    >
      <StyledForm onSubmit={handleSubmit}>
        <Grid container>
          <FormSection container item xs={12}>
            {!task && (
              <>
                <Grid
                  container
                  item
                  xs={12}
                  alignItems="center"
                  justify="space-between"
                >
                  <TopLabel>Add a task</TopLabel>
                  <CloseTaskButtonContainer>
                    <CloseTaskButton onClick={closeDrawer} />
                  </CloseTaskButtonContainer>
                </Grid>
                <FormSectionDivider condensed />
              </>
            )}
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="space-between"
            >
              <PriorityFlag
                active={priorityActive}
                onClick={togglePriorityActive}
              />
              <StatusSelect ref={statusSelectRef} onClick={openStatusPopover}>
                <span>Status:</span>
                <PriorityDot color={status.color} />
                <span>{status.label}</span>
              </StatusSelect>
              <Popover
                open={statusPopoverOpen}
                anchorEl={statusSelectRef?.current}
                onClose={closeStatusPopover}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <List>
                  {statusSelectData.map(
                    renderStatusSelectOption({ closeStatusPopover, setStatus }),
                  )}
                </List>
              </Popover>
            </Grid>
            <Grid item xs={12}>
              <FormContext {...formMethods}>
                <NewTaskDrawerForm
                  isSubtask={isSubtask}
                  defaultValues={defaultValues}
                  handleSubmit={handleSubmit}
                  onMarkComplete={onMarkComplete}
                />
              </FormContext>
            </Grid>
          </FormSection>
          <CondensedFormSection container item xs={12}>
            {task && <NewTaskDrawerCommentSection task={task} />}
            <FormSectionDivider condensed />
            <FormContext {...formMethods}>
              <NewTaskDrawerOtherDataSection task={task} />
            </FormContext>
            <FormSectionDivider condensed />
            <Grid
              alignItems="center"
              justify="center"
              spacing={8}
              container
              item
              xs={12}
            >
              {task && task?.status !== 'COMPLETE' && (
                <Grid item xs={3}>
                  <StyledButton
                    fullWidth
                    onClick={onDelete({
                      afterDelete: () => {
                        closeDrawer();
                      },
                      dispatch,
                      task,
                    })}
                  >
                    Delete
                  </StyledButton>
                </Grid>
              )}
              <Grid item xs={3}>
                <StyledButton
                  type="submit"
                  fullWidth
                  color="primary"
                  variant="contained"
                >
                  Save
                </StyledButton>
              </Grid>
            </Grid>
          </CondensedFormSection>
        </Grid>
      </StyledForm>
    </NewTaskDrawerContainer>
  );
};
