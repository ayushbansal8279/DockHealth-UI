/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
import moment from 'moment';
import { useCallback, useEffect, useState, useRef } from 'react';
import { EditorState } from 'draft-js';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import * as TaskListApi from 'api/task-list-api';
import * as TaskApi from 'api/task-api';
import { TIME_12H_FORMAT, DATE_ISO_FORMAT } from 'helpers/task-drawer-helpers';
import { taskListsSelector } from 'selectors/task-list-selectors';
import {
  saveTask,
  partialUpdateTask,
  storeAsCurrentTask,
  moveTask,
  deleteTask,
  duplicateTask,
  updateTaskDescription,
  prepareSubtask,
  markTaskRead,
  updateDueDate,
} from 'actions/task-actions';
import { UPDATE_TASK_SUCCESS } from 'actions/action-types';
import { openDrawer, closeDrawer } from 'actions/task-drawer-actions';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import {
  onTaskDrawerSubtaskAdd,
  onTaskDrawerTaskDeleted,
  onTaskDrawerTaskDuplicated,
} from 'helpers/ga-event-helper';
import { noop } from 'helpers/utility-functions';

import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { getFormattedLabels } from '../LabelsSection/helpers';

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
  const { tokenizedText } = convertFromEditorStateToOutput(descriptionState);

  if (!tokenizedText) {
    setDescriptionErrorState(true);
    return;
  }

  const requestData = {
    ...(selectedTask ?? {}),
    ...data,
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

  if (requestData.parentTaskIdentifier) {
    onTaskDrawerSubtaskAdd('Form');
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const initializeTaskDrawerHooks = ({
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
    currentUser,
    selectedFilters,
  } = useSelector(store => ({
    taskDrawerOpen: store.taskDrawerState.open,
    taskDrawerFocusField: store.taskDrawerState.focusField,
    selectedTask: store.taskState.selectedTask,
    addingNewSubtask: store.taskState.addingNewSubtask,
    taskLists: taskListsSelector(store),
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

  const [emailBodyMembers, setEmailBodyMembers] = useState(null);

  const taskList = selectedTask?.taskList;
  const taskListIdentifier = taskList?.taskListIdentifier;

  const [isSaving, setSaving] = useState(false);

  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });

  const { setValue, clearError } = formMethods;

  const dispatch = useDispatch();

  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const isAddingOrEditingSubtask =
    Boolean(selectedParentTask) || addingNewSubtask;

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
    if (taskListIdentifier && selectedTask?.sourceMessage) {
      TaskListApi.getMembersByTaskListId(
        taskList.taskListIdentifier,
        'ALL',
      ).then(data => {
        setEmailBodyMembers(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListIdentifier, taskIdentifier]);

  useEffect(() => {
    if (
      taskDrawerOpen &&
      taskList !== undefined &&
      taskList?.taskListIdentifier
    ) {
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
        onTaskDrawerTaskDeleted();
        await deleteTask(selectedTask)(dispatch);
        onTaskDelete(selectedTask);
        storeAsCurrentTask(null)(dispatch);
        afterDelete();
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
        onTaskDrawerTaskDuplicated();
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
        let assignedToUsers = null;
        if (assignToSelf && selectedTask.assignedToUsers) {
          assignedToUsers = selectedTask.assignedToUsers;
        }
        await prepareSubtask(
          selectedTask.taskIdentifier,
          assignedToUsers,
          selectedTask,
        )(dispatch);
        if (typeof afterAddSubTask === 'function') afterAddSubTask();
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
    onTaskDrawerSubtaskAdd('Quick add input');
    return saveTask(taskToCreate)(dispatch);
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
    async updatedTaskData => {
      const updatedTask = await dispatch(
        partialUpdateTask(selectedTaskIdentifier, updatedTaskData),
      );
      onTaskUpdate(updatedTask);
      setAutoSaveVisible();
    },
    [dispatch, onTaskUpdate, selectedTaskIdentifier, setAutoSaveVisible],
  );

  return {
    currentUser,
    currentOrganization,
    selectedTask,
    selectedParentTask,
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
    openTaskDrawer,
    closeTaskDrawer,
    isSaving,
    reFileTask,
    onDelete,
    onDuplicate,
    onAddSubTask,
    handleQuickAddTask,
    handleTaskDescriptionUpdate,
    setAutoSaveVisible,
    emailBodyMembers,
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
  };
};

export default initializeTaskDrawerHooks;
