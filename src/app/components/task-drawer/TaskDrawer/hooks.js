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
import { EditorState } from 'draft-js';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import * as TaskListApi from 'api/tasklist-api';
import * as TaskApi from 'api/task-api';
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
  updateDueDate,
} from 'actions/task-actions';
import { UPDATE_TASK_SUCCESS } from 'actions/action-types';
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
import { MemberAdornmentContainer } from '../NewTaskDrawer.Styled';
import {
  getFormattedLabels,
  TIME_12H_FORMAT,
  DATE_ISO_FORMAT,
} from '../helpers';

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

  const { taskIdentifier, subTasksCount, subtasks } = selectedTask || {};

  const taskDrawerReference = useRef(null);
  const [descriptionState, setDescriptionState] = useMentionsEditorState();
  const [selectedParentTask, setSelectedParentTask] = useState(null);
  const [
    parentDescriptionState,
    setParentDescriptionState,
  ] = useMentionsEditorState();
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);
  const descriptionReference = useRef(null);

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const currentOrganization =
    currentUser?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  const [members, setMembers] = useState(null);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  const taskList = selectedTask?.taskList;
  const taskListIdentifier = taskList?.taskListIdentifier;

  const [isSaving, setSaving] = useState(false);

  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });

  const { setValue, watch, clearError } = formMethods;

  const dispatch = useDispatch();

  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const isAddingOrEditingSubtask =
    Boolean(selectedParentTask) || addingNewSubtask;

  const refreshMembers = () =>
    TaskListApi.getMembersByTaskListId(taskList.taskListIdentifier, 'ALL').then(
      data => {
        setMembers(data);
        return data;
      },
    );

  const previousTaskIdentifierValue = useRef();

  useEffect(() => {
    if (taskIdentifier !== previousTaskIdentifierValue.current) {
      // eslint-disable-next-line no-unused-expressions
      taskDrawerReference?.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [taskIdentifier]);

  useEffect(() => {
    if (
      selectedTask?.parentTask &&
      taskIdentifier !== previousTaskIdentifierValue.current
    ) {
      setSelectedParentTask(selectedTask.parentTask);
    }

    if (
      (taskIdentifier &&
        taskIdentifier !== previousTaskIdentifierValue.current) ||
      (subtasks?.length === 0 && subTasksCount > 0)
    ) {
      TaskApi.getTaskDetails(taskIdentifier).then(task => {
        setSelectedParentTask(task.parentTask || null);
        dispatch({ type: UPDATE_TASK_SUCCESS, task });
      });
    }
    previousTaskIdentifierValue.current = taskIdentifier;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIdentifier, subtasks]);

  useEffect(() => {
    setSelectedParentTask(null);
  }, [taskDrawerOpen]);

  useEffect(() => {
    if (selectedParentTask) {
      const {
        tokenizedDescription,
        description,
        taskMentions,
      } = selectedParentTask;
      if (description) {
        const newContent = createMentionEntities(
          tokenizedDescription,
          description,
          taskMentions,
        );

        setParentDescriptionState(
          EditorState.push(descriptionState, newContent),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentTask]);

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
      'assignedToIdentifier',
      selectedTask?.assignedTo?.userIdentifier ?? null,
    );
    const dueDateMoment = moment(selectedTask?.dueDate ?? null);
    if (dueDateMoment.isValid()) {
      setValue('dueDate', dueDateMoment.format(DATE_ISO_FORMAT));
    } else {
      setValue('dueDate', null);
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
        <Member showTooltip={false} member={currentMember} size={34} />
      </MemberAdornmentContainer>
    ) : null;
  }, [currentAssignedToValue, members]);

  const getMemberAdornment = (memberIdentifier, listMembers) => {
    const currentMember = listMembers?.find(
      ({ userIdentifier }) => memberIdentifier === userIdentifier,
    );
    return currentMember ? (
      <Member showTooltip={false} member={currentMember} size={34} />
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
        await prepareSubtask(
          selectedTask.taskIdentifier,
          assignedTo,
          selectedTask,
        )(dispatch);
        if (typeof afterAddSubTask === 'function') afterAddSubTask();
        onButtonClicked('Add subtask');
      } catch {
        noop();
      }
    }
  };

  const handleQuickAddTask = async newTask => {
    const taskToCreate = {
      ...newTask,
      parentTaskIdentifier: selectedTask.taskIdentifier,
    };
    return saveTask(taskToCreate)(dispatch);
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

  const handlePatientSave = useCallback(
    async patient => {
      const updatedTask = await updatePatient(
        !isAddingOrEditingSubtask ? selectedTask : selectedParentTask,
        patient,
      )(dispatch);
      setAutoSaveVisible();
      onTaskUpdate(updatedTask);
      return updatedTask;
    },
    [
      dispatch,
      isAddingOrEditingSubtask,
      onTaskUpdate,
      selectedParentTask,
      selectedTask,
      setAutoSaveVisible,
    ],
  );

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
        const updatedTask = await updateTaskDescription(
          selectedTask,
          updatedTaskDescription,
        )(dispatch);
        setAutoSaveVisible();
        onTaskUpdate(updatedTask);
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

  const saveDueDateTime = useCallback(
    updatedDueDateTime => {
      updateDueDate(
        selectedTask,
        updatedDueDateTime,
        false,
      )(dispatch)
        .then(task => {
          setAutoSaveVisible();
          onTaskUpdate(task);
          return task;
        })
        .catch(() => {
          dispatch(
            AlertActions.showGlobalErrorAlert(
              'Error updating due date, please try again later',
            ),
          );
        });
    },
    [dispatch, onTaskUpdate, selectedTask, setAutoSaveVisible],
  );

  const clearDueDate = useCallback(
    async event => {
      event.stopPropagation();
      setValue('dueDate', null);
      setValue('dueTime', null);
      if (selectedTask && selectedTask.taskIdentifier != null) {
        saveDueDateTime(null);
      }
    },
    [saveDueDateTime, selectedTask, setValue],
  );

  const handleDueTimeSave = useCallback(
    value => {
      const currentDueDate = moment(selectedTask?.dueDate).format(
        DATE_ISO_FORMAT,
      );

      const updatedDueDateTime = moment(
        `${currentDueDate} ${value}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}}`,
      );

      saveDueDateTime(updatedDueDateTime);
    },
    [saveDueDateTime, selectedTask],
  );

  const handleDueDateSave = useCallback(
    value => {
      const currentDueTime = moment(selectedTask?.dueDate).format(
        TIME_12H_FORMAT,
      );
      const updatedDueDateTime = moment(
        `${value} ${currentDueTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}}`,
      );

      saveDueDateTime(updatedDueDateTime);
    },
    [saveDueDateTime, selectedTask],
  );

  const handleUpdateTask = useCallback(
    async updatedData => {
      const updatedTask = await dispatch(
        saveTask({ ...selectedTask, ...updatedData }),
      );
      onTaskUpdate(updatedTask);
      setAutoSaveVisible();
    },
    [dispatch, onTaskUpdate, selectedTask, setAutoSaveVisible],
  );

  return {
    currentUser,
    currentOrganization,
    selectedTask,
    selectedParentTask,
    labels,
    areLabelsRequested,
    taskDrawerOpen,
    taskDrawerFocusField,
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
    handleQuickAddTask,
    handleAssignedToSelect,
    handleTaskDescriptionUpdate,
    setAutoSaveVisible,
    members,
    isFetchingMembers,
    refreshMembers,
    descriptionState,
    setDescriptionState,
    descriptionReference,
    descriptionErrorState,
    setDescriptionErrorState,
    selectedFilters,
    dispatch,
    parentDescriptionState,
    setParentDescriptionState,
    taskDrawerReference,
    taskListIdentifier,
    handleUpdateTask,
    handleDueDateSave,
    handleDueTimeSave,
    clearDueDate,
    handlePatientSave,
  };
};

export default initializeTaskDrawerHooks;
