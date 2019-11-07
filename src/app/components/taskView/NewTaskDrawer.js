import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import head from 'ramda/es/head';
import React, { useEffect, useRef, useState } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  saveTask,
  assignOrReassignTask,
  updatePatient,
  deleteTask,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import { PriorityDot } from '../common/Priority';
import NewTaskDrawerForm from './NewTaskDrawer.form';
import PriorityFlag from './PriorityFlag';
import { noop, getPatientName } from '../../helpers/utilityFunctions';
import { getAllPatients } from '../../actions/patient-actions';
import { CloseTaskButton } from './TaskDrawerButtons';
import NewTaskDrawerCommentSection from './NewTaskDrawer.commentSection';

const NewTaskDrawerContainer = styled.div`
  align-items: flex-start;
  display: flex;
  height: 100%;
  margin-top: 3.75rem;
  justify-content: flex-start;
  padding: 4px;
  position: sticky;
  transition: all 0.25s ease-out;
  top: 6.25rem;
  width: 40%;
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

  ${props => props.condensed && 'padding: 0 0.5rem;'}
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

const statusSelectData = [
  {
    key: 'in-progress',
    value: null,
    label: 'In Progress',
    color: '#00a73c',
  },
  {
    key: 'on-hold',
    value: 'ON_HOLD',
    label: 'On Hold',
    color: '#f6b039',
  },
  {
    key: 'planned',
    value: 'BLOCKED',
    label: 'Planned',
    color: '#0ca1c7',
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
  closeDrawer,
  dispatch,
  status,
  task,
  taskList,
  priorityActive,
}) => async data => {
  const {
    assignedToUserId,
    patientId,
    patient: unusedPatient,
    ...newData
  } = data;
  let { patient } = data;

  const requestData = {
    ...task,
    ...newData,
    taskListId: taskList.taskListId,
    workflowStatus: status.value,
    priority: priorityActive ? 'HIGH' : 'LOW',
    assignedToId: assignedToUserId,
    patientId,
  };

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
  } catch {
    noop();
  } finally {
    closeDrawer();
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

export default ({ closeDrawer, headsUpAreaRef, taskList }) => {
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

  const isSubtask = Boolean(task?.parentTaskId);

  const formMethods = useForm({});

  useEffect(() => {
    getAllPatients()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
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
    },
    [setPriorityActive, task, unsetPriorityActive],
  );

  useEffect(
    () => {
      setHeadsUpAreaHeight(headsUpAreaRef?.scrollHeight ?? 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [headsUpAreaRef?.scrollHeight],
  );

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

  return (
    <NewTaskDrawerContainer headsUpAreaHeight={headsUpAreaHeight}>
      <form
        onSubmit={formMethods.handleSubmit(
          onSubmit({
            closeDrawer,
            dispatch,
            status,
            task,
            taskList,
            priorityActive,
          }),
        )}
      >
        <Grid container>
          <FormSection container item xs={12}>
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="space-between"
            >
              <TopLabel>{`${task ? 'Edit' : 'Add'} a task`}</TopLabel>
              <CloseTaskButtonContainer>
                <CloseTaskButton onClick={closeDrawer} />
              </CloseTaskButtonContainer>
            </Grid>
            <FormSectionDivider condensed />
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
                />
              </FormContext>
            </Grid>
          </FormSection>
          {task && (
            <CondensedFormSection container item xs={12}>
              <NewTaskDrawerCommentSection task={task} />
            </CondensedFormSection>
          )}
          <FormSection container item xs={12}>
            <div>Other data placeholder</div>
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
                  <Button
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
                  </Button>
                </Grid>
              )}
              <Grid item xs={3}>
                <Button
                  type="submit"
                  fullWidth
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </FormSection>
        </Grid>
      </form>
    </NewTaskDrawerContainer>
  );
};
