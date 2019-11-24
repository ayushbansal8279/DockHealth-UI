import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import moment from 'moment';
import head from 'ramda/es/head';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { getAllPatients } from '../../actions/patient-actions';
import {
  assignOrReassignTask,
  deleteTask,
  duplicateTask,
  moveTask,
  saveTask,
  storeAsCurrentTask as storeAsCurrentTaskAction,
  toggleTaskPriority,
  updatePatient,
  updateWorkflowStatus,
} from '../../actions/task-actions';
import { getPatientName, noop } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import { PriorityDot } from '../common/Priority';
import NewTaskDrawerCommentSection from './NewTaskDrawer.commentSection';
import NewTaskDrawerForm from './NewTaskDrawer.form';
import NewTaskDrawerOtherDataSection from './NewTaskDrawer.otherDataSection';
import {
  AutoSaveContainer,
  AutoSaveLabel,
  BottomButtomContainer,
  CloseTaskButtonContainer,
  CondensedFormSection,
  FormSection,
  FormSectionDivider,
  NewTaskDrawerContainer,
  NewTaskDrawerInnerContainer,
  SideClickListener,
  StatusSelect,
  StyledButton,
  StyledForm,
  StyledVerticalDivider,
  TopLabel,
} from './NewTaskDrawer.styled';
import { taskValidationSchema } from './NewTaskDrawer.validationSchema';
import PriorityFlag from './PriorityFlag';
import { CloseTaskButton } from './TaskDrawerButtons';

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
  saveTaskStatus,
  taskId,
}) => status => {
  const { key, label, color, value } = status;

  return (
    <ListItem
      key={key}
      button
      onClick={() => {
        setStatus(status);
        closeStatusPopover();
        if (taskId) {
          saveTaskStatus({ newTaskStatus: value });
        }
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
  deferredCommentsPromises,
  setAutoSaveVisible,
}) => async data => {
  const {
    assignedToUserId,
    patientId,
    patient: unusedPatient,
    newTaskListId,
    newTaskDueDate,
    description,
    descriptionEdit,
    ...newData
  } = data;
  let { patient } = data;

  const requestData = {
    ...task,
    ...newData,
    description: descriptionEdit || description,
    workflowStatus: status.value,
    priority: priorityActive ? 'HIGH' : 'LOW',
    assignedToId: assignedToUserId,
    patientId,
    taskListId: taskList?.taskListId,
  };

  if(!requestData.description || requestData.description == ""){
    return false;
  }

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
      storeAsCurrentTask({
        ...newTask,
        ...requestData,
        taskId: newTask.taskId || requestData.taskId,
      });
    }

    let commentPromise = Promise.resolve();

    deferredCommentsPromises.forEach(deferredCommentPromise => {
      commentPromise = commentPromise.then(async () =>
        deferredCommentPromise({ task: { ...newTask, ...requestData } }),
      );
    });

    setAutoSaveVisible();
  } catch {
    noop();
  }
};

const onDelete = ({ afterDelete, dispatch, task }) => async event => {
  event.preventDefault();
  event.stopPropagation();
  if (task) {
    try {
      await deleteTask(task)(dispatch);
      afterDelete();
    } catch {
      noop();
    }
  }
};

const onDuplicate = ({ afterDuplicate, dispatch, task }) => async event => {
  event.preventDefault();
  event.stopPropagation();
  if (task && task.taskId != null) {
    try {
      const newTask = await duplicateTask(task)(dispatch);
      afterDuplicate({ newTask });
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
  entries.forEach(entry => {
    const {
      intersectionRect: { height },
      target,
    } = entry;
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

export default ({
  closeDrawer,
  headsUpAreaRef,
  taskList,
  onMarkComplete,
  isInbox,
}) => {
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
  const [deferredCommentsPromises, setDeferredCommentsPromises] = useState([]);
  const statusSelectRef = useRef(null);
  const task = useSelector(store => store.taskState.selectedTask);
  const userProfile = useSelector(store => store.userState.userProfile);
  const dispatch = useDispatch();
  const taskContainerRef = useRef(null);
  const [cachedTaskContainerRef, setCachedTaskContainerRef] = useState(null);
  const [
    autoSaveVisible,
    setAutoSaveVisible,
    unsetAutoSaveVisible,
  ] = useBoolean(false);
  const [autoSaveTimeoutId, setAutoSaveTimeoutId] = useState(null);

  const formMethods = useForm({
    validationSchema: taskValidationSchema,
  });

  const isSubtask = Boolean(task?.parentTaskId);
  const userId = userProfile?.userId;
  const taskId = task?.taskId;
  const taskWorkflowStatus = task?.workflowStatus;
  const taskPriority = task?.priority;

  const storeAsCurrentTask = useCallback(
    newTask => storeAsCurrentTaskAction(newTask)(dispatch),
    [dispatch],
  );

  const saveTaskPriority = useCallback(
    ({ newTaskPriority }) => {
      toggleTaskPriority(task, parseInt(userId, 10) || -1, newTaskPriority)(
        dispatch,
      )
        .then(() => {
          setAutoSaveVisible();
        })
        .catch(() => {
          toggleAlert(
            'Error updating priority, please try again later',
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId, userId],
  );

  const saveTaskStatus = useCallback(
    ({ newTaskStatus }) => {
      updateWorkflowStatus(task, newTaskStatus)(dispatch)
        .then(() => {
          setAutoSaveVisible();
        })
        .catch(() => {
          toggleAlert('Error updating status, please try again later', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId],
  );

  useEffect(() => {
    getAllPatients()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAutoSaveTimeout = () => {
    clearTimeout(autoSaveTimeoutId);
    setAutoSaveTimeoutId(null);
    unsetAutoSaveVisible();
  };

  useEffect(() => {
    if (autoSaveVisible) {
      clearTimeout(autoSaveTimeoutId);
      setAutoSaveTimeoutId(
        setTimeout(() => {
          clearAutoSaveTimeout();
        }, 1000),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveVisible]);

  useEffect(() => {
    const isPriorityHigh = taskPriority === 'HIGH';

    if (isPriorityHigh) {
      setPriorityActive();
    } else {
      unsetPriorityActive();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskPriority, taskId]);

  useEffect(() => {
    const newWorkflowStatus =
      statusSelectData.find(({ value }) => value === taskWorkflowStatus) ??
      head(statusSelectData);

    setStatus(newWorkflowStatus);
  }, [taskWorkflowStatus, taskId]);

  useEffect(
    () => {
      setHeadsUpAreaHeight(headsUpAreaRef?.scrollHeight ?? 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [headsUpAreaRef?.scrollHeight],
  );

  useEffect(() => {
    setCachedTaskContainerRef(taskContainerRef.current);
  }, []);

  useEffect(() => {
    if (cachedTaskContainerRef) {
      observer.observe(taskContainerRef.current);
    }

    return () => {
      if (cachedTaskContainerRef) {
        observer.unobserve(cachedTaskContainerRef);
      }
    };
  }, [cachedTaskContainerRef]);

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

  const addDeferredCommentToQueue = useCallback(
    ({ promise, clearMethod }) => {
      if (deferredCommentsPromises.length === 0) {
        setDeferredCommentsPromises([clearMethod, promise]);
      } else {
        setDeferredCommentsPromises([...deferredCommentsPromises, promise]);
      }
    },
    [deferredCommentsPromises],
  );

  useEffect(() => {
    setDeferredCommentsPromises([]);
    clearAutoSaveTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleSubmit = formMethods.handleSubmit(
    onSubmit({
      closeDrawer,
      dispatch,
      status,
      task,
      taskList,
      priorityActive,
      storeAsCurrentTask,
      deferredCommentsPromises,
      setAutoSaveVisible,
    }),
  );

  const topLabel = (() => {
    if (task && !task.taskId) {
      return 'Add a subtask';
    }

    return 'Add a task';
  })();

  const addingTaskOrSubtask = !task || (task && !task.taskId);

  console.log('render NewTaskDrawer')
  return (
    <NewTaskDrawerContainer
      headsUpAreaHeight={headsUpAreaHeight}
      ref={taskContainerRef}
      onBlur={
        () => {
          setTimeout(() => {
            console.log('on blur')
            handleSubmit()
          }, 500)
        }
      }
    >
      <StyledForm onSubmit={handleSubmit}>
        <NewTaskDrawerInnerContainer>
          <FormSection
            topBorderActive={!addingTaskOrSubtask && autoSaveVisible}
            container
            item
            xs={12}
          >
            {addingTaskOrSubtask && (
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                justify="space-between"
              >
                <TopLabel>{topLabel}</TopLabel>
                <CloseTaskButtonContainer>
                  <CloseTaskButton
                    onClick={() => {
                      closeDrawer();
                      storeAsCurrentTask(null);
                    }}
                  />
                </CloseTaskButtonContainer>
              </Grid>
            )}
            <FormSectionDivider
              addingTaskOrSubtask={addingTaskOrSubtask}
              active={autoSaveVisible}
            >
              <AutoSaveContainer visible={autoSaveVisible}>
                <AutoSaveLabel visible={autoSaveVisible}>Saved</AutoSaveLabel>
              </AutoSaveContainer>
            </FormSectionDivider>
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="space-between"
            >
              <PriorityFlag
                active={priorityActive}
                onClick={() => {
                  const newTaskPriority = priorityActive ? 'HIGH' : 'LOW';
                  togglePriorityActive();
                  if (taskId) {
                    saveTaskPriority({ newTaskPriority });
                  }
                }}
              />
              <StatusSelect ref={statusSelectRef} onClick={openStatusPopover}>
                <span>Status:</span>
                <PriorityDot color={status.color} />
                <span>{status.label}</span>
              </StatusSelect>
              {!addingTaskOrSubtask && (
                <CloseTaskButtonContainer>
                  <CloseTaskButton
                    onClick={() => {
                      closeDrawer();
                      storeAsCurrentTask(null);
                    }}
                    paddedSmall
                  />
                </CloseTaskButtonContainer>
              )}
              <Popover
                anchorEl={statusSelectRef?.current}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                disablePortal
                onClose={closeStatusPopover}
                open={statusPopoverOpen}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <List>
                  {statusSelectData.map(
                    renderStatusSelectOption({
                      closeStatusPopover,
                      setStatus,
                      saveTaskStatus,
                      taskId,
                    }),
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
                  setAutoSaveVisible={setAutoSaveVisible}
                  isInbox={isInbox}
                />
              </FormContext>
            </Grid>
          </FormSection>
          <CondensedFormSection container item xs={12}>
            <NewTaskDrawerCommentSection
              task={task}
              addDeferredCommentToQueue={addDeferredCommentToQueue}
            />
            <FormSectionDivider condensed />
            <FormContext {...formMethods}>
              <NewTaskDrawerOtherDataSection
                task={task}
                taskList={taskList}
                closeDrawer={closeDrawer}
                setAutoSaveVisible={setAutoSaveVisible}
                isInbox={isInbox}
              />
            </FormContext>
          </CondensedFormSection>
        </NewTaskDrawerInnerContainer>
        {task && task.taskId != null && task.status !== 'COMPLETE' && (
          <BottomButtomContainer>
            <StyledButton
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
            <StyledVerticalDivider />
            <StyledButton
              onClick={onDuplicate({
                afterDuplicate: ({ newTask }) => {
                  storeAsCurrentTask(newTask);
                },
                dispatch,
                task,
              })}
            >
              Duplicate
            </StyledButton>
          </BottomButtomContainer>
        )}
        {/* If you want to add a button to the Add a task sidebar, do so here.  */}
        <SideClickListener onClick={closeDrawer} />
      </StyledForm>
    </NewTaskDrawerContainer>
  );
};
