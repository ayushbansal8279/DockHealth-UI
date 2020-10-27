/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import debounce from 'lodash.debounce';
import { EditorState } from 'draft-js';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount, useUnmount } from 'react-use';
import { getPatientsByName, addPatient } from 'api/patient-api';
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
  markTaskRead,
} from 'actions/task-actions';
import { openDrawer, closeDrawer } from 'actions/task-drawer-actions';
import { getTaskListLabels } from 'actions/task-label-actions';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import Member from 'components/members/Member/Member';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import { onButtonClicked } from 'helpers/ga-event-helper';
import { noop } from 'helpers/utility-functions';

import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { MemberAdornmentContainer } from './NewTaskDrawer.Styled';
import { getFormattedLabels } from './NewTaskDrawer.Utilities';

// const REQUIRED_MESSAGE = 'This field is required';
// const TIME_12H_FORMAT_REGULAR_EXPRESSION = /^(1[0-2]|0{0,1}[1-9]):([0-5]\d) [APap][Mm]$/;
const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const TIME_12H_FORMAT = 'hh:mm A';
// const TIME_24H_FORMAT = 'HH:mm';
const DATETIME_FULL_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ';

const onSubmit = ({
  selectedTask,
  taskList,
  dispatch,
  setSaving,
  setAutoSaveVisible,
  closeTaskDrawer,
  onTaskUpdate,
  descriptionState,
  setDescriptionErrorState,
}) => (data, event) => {
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

  const { tokenizedText } = convertFromEditorStateToOutput(descriptionState);

  if (!tokenizedText) {
    setDescriptionErrorState(true);
    return;
  }

  const requestData = {
    ...(selectedTask ?? {}),
    ...data,
    // labels: [],
    taskListIdentifier: taskList?.taskListIdentifier,
    description: tokenizedText,
  };

  const dueDate = moment(requestData.dueDate);
  const dueTime = moment(requestData.dueTime, TIME_12H_FORMAT);

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
      onTaskUpdate(response);

      setSaving(false);
      setAutoSaveVisible();

      if (event?.target === 'form') {
        closeTaskDrawer();
      }
    })
    .catch(() => {
      setSaving(false);
    });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const initializeTaskDrawerHooks = ({
  isInbox,
  onTaskUpdate,
  onTaskCreation,
  onTaskDelete,
}) => {
  const {
    taskDrawerOpen,
    taskDrawerFocusField,
    selectedTask,
    addingNewSubtask,
    tasks,
    taskLists,
    labels,
    areLabelsRequested,
    currentUser,
    selectedFilters,
  } = useSelector(store => ({
    taskDrawerOpen: store.taskDrawerState.open,
    taskDrawerFocusField: store.taskDrawerState.focusField,
    selectedTask: store.taskState.selectedTask,
    addingNewSubtask: store.taskState.addingNewSubtask,
    tasks: store.listDetails.tasks,
    taskLists: store.taskListState.tasklist,
    labels: isInbox
      ? store.taskLabelState.data.inboxLabels
      : store.taskLabelState.data.listLabels,
    areLabelsRequested: isInbox
      ? store.taskLabelState.requesting.inboxLabels
      : store.taskLabelState.requesting.listLabels,
    currentUser: store.userState.userProfile,
    selectedFilters: selectedFiltersInMegaFilterSelector(store),
  }));

  const [descriptionState, setDescriptionState] = useMentionsEditorState();
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);
  const descriptionReference = useRef(null);

  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const patientInputReference = useRef(null);
  const [patientInputValue, setPatientInputValue] = useState('');

  const fetchPatients = value =>
    getPatientsByName(value).then(fetchedPatients => {
      setPatients(fetchedPatients);
      return fetchedPatients;
    });

  const fetchPatientsWithDebounce = useCallback(
    debounce(value => {
      fetchPatients(value).then(() => {
        setIsLoadingPatients(false);
      });
    }, 300),
    [],
  );

  const onPatientInputChange = useCallback(
    (_event, value, reason) => {
      if (reason === 'input' && value !== '') {
        setIsLoadingPatients(true);
        setPatientInputValue(value);
        fetchPatientsWithDebounce(value);
      }
    },
    [fetchPatientsWithDebounce],
  );

  const [members, setMembers] = useState(null);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  const taskList = selectedTask?.taskList;
  const taskListIdentifier = taskList?.taskListIdentifier;

  const [isSaving, setSaving] = useState(false);

  const dueTimeReference = useRef();

  const formMethods = useForm({
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

  const refreshMembers = () =>
    TaskListApi.getMembersByTaskListId(taskList.taskListIdentifier, 'ALL').then(
      data => {
        setMembers(data);
        return data;
      },
    );

  useEffect(() => {
    if (taskListIdentifier) {
      setIsFetchingMembers(true);
      refreshMembers()
        .then(() => {
          setIsFetchingMembers(false);
        })
        .catch(error => {
          setIsFetchingMembers(false);
          throw error;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListIdentifier]);

  useEffect(() => {
    if (
      taskDrawerOpen &&
      taskList !== undefined &&
      taskList?.taskListIdentifier
    ) {
      if (selectedTask?.patient?.patientIdentifier) {
        setPatients([selectedTask?.patient]);
        setValue('patientIdentifier', selectedTask.patient.patientIdentifier);
      }

      getTaskListLabels({ taskListIdentifier: taskList?.taskListIdentifier })(
        dispatch,
      );
      markTaskRead(selectedTask)(dispatch);
    }

    clearError(); // clear any previous validation errors

    if (selectedTask) {
      const { tokenizedDescription, description, taskMentions } = selectedTask;
      if (description) {
        const newContent = createMentionEntities(
          tokenizedDescription,
          description,
          taskMentions,
        );

        setDescriptionState(EditorState.push(descriptionState, newContent));
      } else {
        setDescriptionState();
      }
    }

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
      const dueTimeValue = dueDateMoment.format(TIME_12H_FORMAT);
      if (dueTimeValue === '00:00 AM' || dueTimeValue === '12:00 AM') {
        setValue('dueTime', null);
        if (dueTimeReference && dueTimeReference.current) {
          dueTimeReference.current.value = null;
        }
      } else {
        setValue('dueTime', dueTimeValue);
        if (dueTimeReference && dueTimeReference.current) {
          dueTimeReference.current.value = dueTimeValue;
        }
      }
    } else {
      setValue('dueDate', null);
      setValue('dueTime', null);
      if (dueTimeReference && dueTimeReference.current) {
        dueTimeReference.current.value = null;
      }
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
    setValue('newTaskListId', null);
  });

  useUnmount(() => {
    setPatients([]);
  });

  const openTaskDrawer = useCallback(() => {
    openDrawer()(dispatch);
  }, [dispatch]);

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
          dispatch(
            AlertActions.showGlobalAlert(
              `${AlertMessages.TASK_MOVED} to list ${newTaskList.listName}`,
            ),
          );
          onTaskDelete(selectedTask);
          storeAsCurrentTask(null)(dispatch);
          closeDrawer();
        })
        .catch(() => {
          dispatch(
            AlertActions.showGlobalAlert(
              `Error moving task to list ${newTaskList.listName}, please try again later`,
              'error',
            ),
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
        onTaskDelete(selectedTask);
        storeAsCurrentTask(null)(dispatch);
        afterDelete();
        onButtonClicked('Delete task');
      } catch {
        noop();
      }
    }
  };

  const onDuplicate = ({
    afterDuplicate,
    includeAttachments,
  }) => async event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        const newTask = await duplicateTask(
          selectedTask,
          includeAttachments,
        )(dispatch);
        onTaskCreation(newTask);
        storeAsCurrentTask(newTask)(dispatch);
        afterDuplicate({ newTask });
        onButtonClicked('Duplicate task');
      } catch {
        noop();
      }
    }
  };

  const onAddSubTask = ({ afterAddSubTask, assignToSelf }) => async event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        let assignedTo = null;
        if (assignToSelf && selectedTask.assignedTo) {
          assignedTo = selectedTask.assignedTo;
        }
        await prepareSubtask(selectedTask.taskIdentifier, assignedTo)(dispatch);
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

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        const updatedTask = await assignOrReassignTask(
          selectedTask,
          member?.userIdentifier,
        )(dispatch);
        setAutoSaveVisible();
        onTaskUpdate(updatedTask);
      } catch {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error updating assignment, please try again later',
            'error',
          ),
        );
      }
    }
  };

  const handleUpdatePatient = async (patient = null) => {
    try {
      const updatedTask = await updatePatient(
        !isAddingOrEditingSubtask ? selectedTask : selectedTaskParent,
        patient,
      )(dispatch);
      setAutoSaveVisible();
      onTaskUpdate(updatedTask);
    } catch {
      dispatch(
        AlertActions.showGlobalAlert(
          'Error updating patient, please try again later',
          'error',
        ),
      );
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
      await handleUpdatePatient(patient);
    }
  };

  const clearSelectedPatient = async () => {
    setValue('patientIdentifier', null);
    setValue('patientName', null);
    setPatients([]);
    if (selectedTask && selectedTask.taskIdentifier != null) {
      await handleUpdatePatient();
    }
  };

  const handleAddPatient = patient => {
    const [firstName, ...lastNames] = patient.split(' ');

    const data = { firstName, lastName: lastNames.join(' ') };

    addPatient(data)
      .then(async ({ patientIdentifier, firstName: name, lastName }) => {
        await fetchPatients(patient);

        await handlePatientSelect({
          value: patientIdentifier,
          displayLabel: `${name} ${lastName}`,
        });

        patientInputReference.current.querySelector('input').blur();
      })
      .catch(noop);
  };

  const handleTaskDescriptionUpdate = async () => {
    const updatedTaskDescription = convertFromEditorStateToOutput(
      descriptionState,
    ).tokenizedText;

    if (
      updatedTaskDescription === '' ||
      selectedTask.tokenizedDescription === updatedTaskDescription
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
        dispatch(
          AlertActions.showGlobalAlert(
            'Error updating task description, please try again later',
            'error',
          ),
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
    taskDrawerFocusField,
    top,
    onSubmit: onSubmit({
      selectedTask,
      taskList,
      dispatch,
      setSaving,
      setAutoSaveVisible,
      closeTaskDrawer,
      onTaskUpdate,
      descriptionState,
      setDescriptionErrorState,
    }),
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    taskLists,
    currentAssignedToAdornment,
    getMemberAdornment,
    openTaskDrawer,
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
    clearSelectedPatient,
    dueTimeReference,
    onPatientInputChange,
    patientInputReference,
    patientInputValue,
    isLoadingPatients,
    refreshMembers,
    handleAddPatient,
    descriptionState,
    setDescriptionState,
    descriptionReference,
    descriptionErrorState,
    setDescriptionErrorState,
    selectedFilters,
  };
};

export default initializeTaskDrawerHooks;
