/* eslint-disable react-hooks/rules-of-hooks */
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { getAllPatients } from 'actions/patient-actions';
import * as TaskListApi from 'api/tasklist-api';
import {
  saveTask,
  storeAsCurrentTask,
  moveTask,
  deleteTask,
  duplicateTask,
  assignOrReassignTask,
  updatePatient,
  updateTaskDescription,
  prepareSubtask,
} from 'actions/task-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import { getTaskListLabels } from 'actions/task-label-actions';
import Member from 'components/members/Member';

import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { MemberAdornmentContainer } from './NewTaskDrawer.Styled';
import { getFormattedLabels } from './NewTaskDrawer.Utilities';
import { onButtonClicked } from '../../../helpers/ga-event-helper';
import { noop } from '../../../helpers/utility-functions';

// const REQUIRED_MESSAGE = 'This field is required';
// const TIME_12H_FORMAT_REGULAR_EXPRESSION = /^(1[0-2]|0{0,1}[1-9]):([0-5]\d) [APap][Mm]$/;
const DATE_ISO_FORMAT = 'YYYY-MM-DD';
// const TIME_12H_FORMAT = 'h:mm A';
const TIME_24H_FORMAT = 'HH:mm';
const DATETIME_FULL_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ';

const validationSchema = object().shape({
  description: string().required('Task description is required'),
  // dueTime: string().matches(TIME_12H_FORMAT_REGULAR_EXPRESSION, {
  // excludeEmptyString: true,
  // message: 'Time should be provided in HH:MM PM/AM format',
  // }),
});

const onSubmit = ({
  selectedTask,
  taskList,
  dispatch,
  setSaving,
  setAutoSaveVisible,
  closeTaskDrawer,
}) => data => {
  // const currentLabels = selectedTask?.labels ?? [];
  // const currentLabelsIdentifiers = currentLabels.map(prop('labelIdentifier'));

  // const formattedLabels = (data.labels ?? []).map(
  //   ({ value, displayLabel }) => ({
  //     labelIdentifier: value,
  //     labelName: displayLabel,
  //   }),
  // );

  // const allLabels = [...currentLabels, ...formattedLabels];

  // const formattedLabelsIdentifiers = formattedLabels.map(
  //   prop('labelIdentifier'),
  // );

  const requestData = {
    ...(selectedTask ?? {}),
    ...data,
    // labels: [],
    taskListIdentifier: taskList?.taskListIdentifier,
  };

  const dueDate = moment(requestData.dueDate);
  const dueTime = moment(requestData.dueTime, TIME_24H_FORMAT);

  if (dueTime.isValid()) {
    dueDate.set({
      hour: dueTime.hour(),
      minute: dueTime.minute(),
    });
  }

  requestData.dueDate = dueDate.isValid()
    ? dueDate.format(DATETIME_FULL_FORMAT)
    : null;
  delete requestData.dueTime;

  setSaving(true);

  saveTask(requestData)(dispatch)
    .then(async response => {
      const taskIdentifier = response?.taskIdentifier;

      if (!taskIdentifier) return;
      storeAsCurrentTask(response)(dispatch);

      setSaving(false);
      setAutoSaveVisible();

      closeTaskDrawer();
    })
    .catch(() => {
      setSaving(false);
    });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const initializeTaskDrawerHooks = ({ isInbox }) => {
  const {
    patients,
    taskDrawerOpen,
    selectedTask,
    addingNewSubtask,
    tasks,
    taskLists,
    labels,
    areLabelsRequested,
    currentUser,
  } = useSelector(store => ({
    taskDrawerOpen: store.taskDrawerState.open,
    patients: store.patientState.allPatients,
    selectedTask: store.taskState.selectedTask,
    addingNewSubtask: store.taskState.addingNewSubtask,
    tasks: store.taskState.tasks,
    taskLists: store.taskListState.tasklist,
    labels: isInbox
      ? store.taskLabelState.data.inboxLabels
      : store.taskLabelState.data.listLabels,
    areLabelsRequested: isInbox
      ? store.taskLabelState.requesting.inboxLabels
      : store.taskLabelState.requesting.listLabels,
    currentUser: store.userState.userProfile,
  }));

  const [members, setMembers] = useState(null);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  const taskList = selectedTask?.taskList;

  const [isSaving, setSaving] = useState(false);

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { setValue, watch, clearError } = formMethods;

  const dispatch = useDispatch();
  const setAutoSaveVisible = () => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  };

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const selectedTaskParent = useMemo(
    () =>
      tasks?.find(
        ({ taskIdentifier }) =>
          taskIdentifier === selectedTask?.parentTaskIdentifier,
      ) ?? null,
    [selectedTask, tasks],
  );

  const isAddingOrEditingSubtask =
    Boolean(selectedTaskParent) || addingNewSubtask;

  const { top } =
    document.querySelector('#content-container')?.getBoundingClientRect() || {};

  useEffect(() => {
    if (taskList?.taskListIdentifier) {
      setIsFetchingMembers(true);
      TaskListApi.getMembersByTaskListId(taskList.taskListIdentifier, 'ALL')
        .then(data => {
          setMembers(data);
          setIsFetchingMembers(false);
        })
        .catch(error => {
          setIsFetchingMembers(false);
          throw error;
        });
    }
  }, [taskList]);

  useEffect(() => {
    if (taskDrawerOpen && taskList !== undefined) {
      getTaskListLabels({ taskListIdentifier: taskList?.taskListIdentifier })(
        dispatch,
      );
    }

    clearError(); // clear any previous validation errors
    setValue('description', selectedTask?.description ?? null);
    setValue(
      'patientIdentifier',
      selectedTask?.patient?.patientIdentifier ??
        selectedTaskParent?.patient?.patientIdentifier ??
        null,
    );
    setValue(
      'assignedToIdentifier',
      selectedTask?.assignedTo?.userIdentifier ?? null,
    );
    const dueDateMoment = moment(selectedTask?.dueDate ?? null);

    if (dueDateMoment.isValid()) {
      setValue('dueDate', dueDateMoment.format(DATE_ISO_FORMAT));
      setValue('dueTime', dueDateMoment.format(TIME_24H_FORMAT));
    } else {
      setValue('dueDate', null);
      setValue('dueTime', null);
    }

    setValue('priority', selectedTask?.priority ?? null);
    setValue('workflowStatus', selectedTask?.workflowStatus ?? null);
    setValue(
      'labels',
      getFormattedLabels({ labels: selectedTask?.labels ?? [] }),
    );

    // Exhaustive deps are disabled due to selectedTask referential inequality triggerting useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier, setValue, taskDrawerOpen]);

  useMount(() => {
    getAllPatients()(dispatch);
    setValue('newTaskListId', null);
  });

  const closeTaskDrawer = useCallback(() => {
    closeDrawer()(dispatch);
    storeAsCurrentTask(null)(dispatch);
  }, [dispatch]);

  const currentAssignedToValue = watch('assignedToIdentifier');

  const currentAssignedToAdornment = useMemo(() => {
    const currentMember = members?.find(
      ({ userIdentifier }) => currentAssignedToValue === userIdentifier,
    );

    return currentMember ? (
      <MemberAdornmentContainer>
        <Member showTooltip={false} member={currentMember} size={30} />
      </MemberAdornmentContainer>
    ) : null;
  }, [currentAssignedToValue, members]);

  const getMemberAdornment = (memberIdentifier, listMembers) => {
    const currentMember = listMembers?.find(
      ({ userIdentifier }) => memberIdentifier === userIdentifier,
    );
    return currentMember ? (
      <Member showTooltip={false} member={currentMember} size={30} />
    ) : null;
  };

  const reFileTask = useCallback(
    ({ newTaskList }) => {
      moveTask(
        selectedTask,
        newTaskList,
      )(dispatch)
        .then(() => {
          toggleAlert(
            `Task moved successfully to list ${newTaskList.listName}`,
            'success',
          );
          storeAsCurrentTask(null)(dispatch);
          closeDrawer();
        })
        .catch(() => {
          toggleAlert(
            `Error moving task to list ${newTaskList.listName}, please try again later`,
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTask],
  );

  const onDelete = async ({ afterDelete }) => {
    if (selectedTask) {
      try {
        await deleteTask(selectedTask)(dispatch);
        storeAsCurrentTask(null)(dispatch);
        afterDelete();
        onButtonClicked('Delete task');
      } catch {
        noop();
      }
    }
  };

  const onDuplicate = ({ afterDuplicate }) => async event => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        const newTask = await duplicateTask(selectedTask)(dispatch);
        storeAsCurrentTask(newTask)(dispatch);
        afterDuplicate({ newTask });
        onButtonClicked('Duplicate task');
      } catch {
        noop();
      }
    }
  };

  const onAddSubTask = ({ afterAddSubTask }) => async event => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        prepareSubtask(selectedTask.taskIdentifier)(dispatch);
        afterAddSubTask();
        onButtonClicked('Add subtask');
      } catch {
        noop();
      }
    }
  };

  const handleAssignedToSelect = async selectedOption => {
    const member = {
      userIdentifier: selectedOption.value,
      userName: selectedOption.displayLabel,
    };
    setValue('assignedToUserIdentifier', member?.userIdentifier);
    setValue('assignedToUserName', member?.userName);
    // closeAssignedToPopover();

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        await assignOrReassignTask(
          selectedTask,
          member?.userIdentifier,
        )(dispatch);
        setAutoSaveVisible();
      } catch {
        toggleAlert(
          'Error updating assignment, please try again later',
          'error',
        );
      }
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePatientSelect = async selectedOption => {
    const patient = {
      patientIdentifier: selectedOption.value,
      patientName: selectedOption.displayLabel,
    };
    setValue('patientIdentifier', patient?.patientIdentifier);
    setValue('patientName', patient?.patientName);
    // closePatientPopover();

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        await updatePatient(selectedTask, patient)(dispatch);
        setAutoSaveVisible();
      } catch {
        toggleAlert('Error updating patient, please try again later', 'error');
      }
    }
  };

  const handleTaskDescriptionUpdate = async () => {
    const updatedTaskDescription = watch('description');

    if (
      updatedTaskDescription === '' ||
      selectedTask.description === updatedTaskDescription
    ) {
      return;
    }

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        await updateTaskDescription(
          selectedTask,
          updatedTaskDescription,
        )(dispatch);
        setAutoSaveVisible();
      } catch {
        toggleAlert(
          'Error updating task description, please try again later',
          'error',
        );
      }
    }
  };

  return {
    currentUser,
    selectedTask,
    labels,
    areLabelsRequested,
    taskDrawerOpen,
    top,
    onSubmit: onSubmit({
      selectedTask,
      taskList,
      dispatch,
      setSaving,
      setAutoSaveVisible,
      closeTaskDrawer,
    }),
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    taskLists,
    currentAssignedToAdornment,
    getMemberAdornment,
    closeTaskDrawer,
    isSaving,
    reFileTask,
    onDelete,
    onDuplicate,
    onAddSubTask,
    handleAssignedToSelect,
    handlePatientSelect,
    handleTaskDescriptionUpdate,
    setAutoSaveVisible,
    members,
    isFetchingMembers,
  };
};

export default initializeTaskDrawerHooks;
