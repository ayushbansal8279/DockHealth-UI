/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
import {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
} from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, batch } from 'react-redux';
import moment from 'moment';
import { EditorState } from 'draft-js';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import * as TaskApi from 'api/task-api';
import {
  saveTask,
  partialUpdateTask,
  storeAsCurrentTask,
  moveTask,
  deleteTask,
  duplicateTask,
  updateTaskDescription,
  updateTaskDetails,
  prepareSubtask,
  markTaskRead,
  updateDueDate,
  addSubtask,
} from 'actions/task-actions';
import { UPDATE_TASK_SUCCESS } from 'actions/action-types';
import { openDrawer, closeDrawer } from 'actions/task-drawer-actions';
import {
  selectedTaskSelector,
  taskDrawerOpenSelector,
  taskDrawerFocusFieldSelector,
  addingNewSubtaskSelector,
} from 'selectors/task-drawer-selectors';
import {
  onTaskDrawerSubtaskAdd,
  onTaskDrawerTaskDeleted,
  onTaskDrawerTaskDuplicated,
} from 'helpers/ga-event-helper';
import { noop } from 'helpers/utility-functions';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { TIME_12H_FORMAT, DATE_ISO_FORMAT } from 'helpers/task-drawer-helpers';

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

  let createTaskAction;

  if (requestData.parentTaskIdentifier && !requestData.taskIdentifier) {
    onTaskDrawerSubtaskAdd('Form');
    createTaskAction = addSubtask(
      requestData.parentTaskIdentifier,
      requestData,
    );
  } else {
    createTaskAction = saveTask(requestData);
  }

  dispatch(createTaskAction)
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

const initializeTaskDrawerHooks = ({
  onTaskUpdate,
  onTaskCreation,
  onTaskDelete,
}) => {
  const dispatch = useDispatch();
  const taskDrawerOpen = useSelector(taskDrawerOpenSelector);
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
  const selectedTask = useSelector(selectedTaskSelector);
  const addingNewSubtask = useSelector(addingNewSubtaskSelector);
  // console.log(taskDrawerOpen, selectedTask);

  const [selectedParentTask, setSelectedParentTask] = useState(null);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);
  const [isDetailsFocused, setIsDetailsFocused] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const descriptionReference = useRef(null);
  const detailsReference = useRef(null);
  const previousTaskIdentifierValue = useRef();
  const taskDrawerReference = useRef(null);

  const [descriptionState, setDescriptionState] = useMentionsEditorState();
  const [detailsState, setDetailsState] = useMentionsEditorState();
  const [
    parentDescriptionState,
    setParentDescriptionState,
  ] = useMentionsEditorState();

  const { taskIdentifier, subTasksCount, subtasks } = selectedTask || {};
  const taskList = selectedTask?.taskList;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const templateBundleIdentifier = selectedTask?.templateBundleIdentifier;
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const selectedTaskSourceMessage = selectedTask?.sourceMessage;
  const isAddingOrEditingSubtask =
    Boolean(selectedParentTask) || addingNewSubtask;
  const isSubtask = !!selectedTask?.parentTaskIdentifier;
  const parentTask = selectedTask?.parentTask;
  const selectedTaskDueDate = selectedTask?.dueDate;
  const selectedTaskStatus = selectedTask?.status;

  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });

  const onFocusDetailsEditor = () => {
    setIsDetailsFocused(true);
  };

  const { setValue, clearError } = formMethods;

  useEffect(() => {
    setValue('newTaskListId', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (parentTask && taskIdentifier !== previousTaskIdentifierValue.current) {
      setSelectedParentTask(parentTask);
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
    if (selectedTask && selectedTask.description === '') {
      setTimeout(() => {
        descriptionReference.current.focus();
      }, 0);
    }
  }, [descriptionReference, isAddingOrEditingSubtask, selectedTask]);

  useLayoutEffect(() => {
    if (taskIdentifier !== previousTaskIdentifierValue.current) {
      // eslint-disable-next-line no-unused-expressions
      taskDrawerReference?.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [taskIdentifier]);

  useLayoutEffect(() => {
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
          false,
        );

        setParentDescriptionState(
          EditorState.push(descriptionState, newContent),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentTask]);

  useLayoutEffect(() => {
    if (taskDrawerOpen && taskList !== undefined && taskListIdentifier) {
      markTaskRead(selectedTask)(dispatch);
    }

    clearError(); // clear any previous validation errors

    if (selectedTask) {
      const {
        tokenizedDescription,
        description,
        taskMentions,
        details,
        tokenizedDetails,
      } = selectedTask;
      if (description) {
        const newContent = createMentionEntities(
          tokenizedDescription,
          description,
          taskMentions,
          false,
        );

        setDescriptionState(EditorState.push(descriptionState, newContent));
      } else {
        setDescriptionState();
      }
      if (details) {
        const newContent = createMentionEntities(
          tokenizedDetails,
          details,
          taskMentions,
          true,
        );
        setDetailsState(EditorState.push(detailsState, newContent));
      } else {
        setDetailsState();
      }
    }
    const dueDateMoment = moment(selectedTask?.dueDate ?? null);
    if (dueDateMoment.isValid()) {
      setValue('dueDate', dueDateMoment.format(DATE_ISO_FORMAT));
    } else {
      setValue('dueDate', null);
    }

    setValue('priority', selectedTask?.priority ?? null);
    setValue(
      'labels',
      getFormattedLabels({ labels: selectedTask?.labels ?? [] }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier, setValue, taskDrawerOpen]);

  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const openTaskDrawer = useCallback(() => {
    openDrawer()(dispatch);
  }, [dispatch]);

  const closeTaskDrawer = useCallback(
    () =>
      batch(() => {
        closeDrawer()(dispatch);
        storeAsCurrentTask(null)(dispatch);
      }),
    [dispatch],
  );

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

  const onDelete = useCallback(
    async ({ afterDelete }) => {
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
    },
    [dispatch, onTaskDelete, selectedTask],
  );

  const onDuplicate = useCallback(
    ({ afterDuplicate, includeAttachments }) => async event => {
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
    },
    [dispatch, onTaskCreation, selectedTask],
  );

  const onAddSubTask = useCallback(
    ({ afterAddSubTask, assignToSelf }) => async event => {
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
    },
    [dispatch, selectedTask],
  );

  const handleQuickAddSubtask = useCallback(
    async newSubtask => {
      onTaskDrawerSubtaskAdd('Quick add input');
      return dispatch(addSubtask(selectedTaskIdentifier, newSubtask));
    },
    [dispatch, selectedTaskIdentifier],
  );

  const handleTaskDescriptionUpdate = useCallback(async () => {
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
  }, [
    descriptionState,
    dispatch,
    onTaskUpdate,
    selectedTask,
    setAutoSaveVisible,
  ]);

  const handleTaskDetailsUpdate = useCallback(async () => {
    const updatedTaskDetails = convertFromEditorStateToOutput(detailsState)
      .tokenizedText;

    if (
      updatedTaskDetails === '' ||
      selectedTask.tokenizedDetails === updatedTaskDetails
    ) {
      return;
    }

    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        const updatedTask = await updateTaskDetails(
          selectedTask,
          updatedTaskDetails,
        )(dispatch);
        setAutoSaveVisible();
        onTaskUpdate(updatedTask);
      } catch {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error updating task Details, please try again later',
            'error',
          ),
        );
      }
    }
  }, [detailsState, dispatch, onTaskUpdate, selectedTask, setAutoSaveVisible]);

  const handleDueDateSave = useCallback(
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

  const newTaskFlag = useMemo(
    () => !(selectedTask && selectedTaskIdentifier != null),
    [selectedTask, selectedTaskIdentifier],
  );

  const isAddingSubtask = useMemo(
    () => selectedTask && selectedTaskIdentifier === null && isSubtask,
    [isSubtask, selectedTask, selectedTaskIdentifier],
  );

  const isSelectedTaskComplete = useMemo(
    () => selectedTaskStatus === 'COMPLETE',
    [selectedTaskStatus],
  );

  const taskDueTime = useMemo(() => {
    const momentDueTime = moment(selectedTaskDueDate || null);
    if (momentDueTime.isValid()) {
      return momentDueTime.format(TIME_12H_FORMAT);
    }
    return null;
  }, [selectedTaskDueDate]);

  const isTemplateTask = useMemo(() => checkIfTemplateTask(selectedTask), [
    selectedTask,
  ]);
  const onClickParentTask = useCallback(
    () => storeAsCurrentTask(selectedParentTask)(dispatch),
    [dispatch, selectedParentTask],
  );
  const onFocusMentionsEditor = useCallback(
    () => setIsDescriptionFocused(true),
    [],
  );
  const onBlurMentionsEditor = useCallback(() => {
    handleTaskDescriptionUpdate();
    setIsDescriptionFocused(false);
  }, [handleTaskDescriptionUpdate]);

  const onBlurDetailsEditor = useCallback(() => {
    setIsDetailsFocused(false);
    handleTaskDetailsUpdate();
  }, [handleTaskDetailsUpdate]);

  const onChangeMentionsEditor = useCallback(
    state => {
      if (descriptionErrorState) {
        const { tokenizedText } = convertFromEditorStateToOutput(state);
        if (tokenizedText) {
          setDescriptionErrorState(false);
        }
      }
      setDescriptionState(state);
    },
    [descriptionErrorState, setDescriptionState],
  );

  const onChangeDetailsEditor = useCallback(
    state => {
      setDetailsState(state);
    },
    [setDetailsState],
  );

  return {
    closeTaskDrawer,
    descriptionErrorState,
    descriptionReference,
    detailsReference,
    descriptionState,
    detailsState,
    formMethods,
    handleDueDateSave,
    handleQuickAddSubtask,
    handleUpdateTask,
    isSubtask,
    isAddingOrEditingSubtask,
    isAddingSubtask,
    isDescriptionFocused,
    isSaving,
    isSelectedTaskComplete,
    isTemplateTask,
    newTaskFlag,
    onAddSubTask,
    onBlurMentionsEditor,
    onChangeMentionsEditor,
    onClickParentTask,
    onDelete,
    onDuplicate,
    onFocusMentionsEditor,
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
    openTaskDrawer,
    parentDescriptionState,
    reFileTask,
    selectedParentTask,
    selectedTask,
    selectedTaskSourceMessage,
    setAutoSaveVisible,
    setParentDescriptionState,
    taskDrawerFocusField,
    taskDrawerOpen,
    taskDrawerReference,
    taskDueTime,
    taskListIdentifier,
    templateBundleIdentifier,
    onBlurDetailsEditor,
    onChangeDetailsEditor,
    onFocusDetailsEditor,
    isDetailsFocused,
  };
};

export default initializeTaskDrawerHooks;
