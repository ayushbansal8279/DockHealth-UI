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
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
import moment from 'moment';
// import { EditorState } from 'draft-js';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
// import * as TaskApi from 'api/task-api';
import {
  partialUpdateTask,
  storeAsCurrentTask,
  deleteTask,
  duplicateTask,
  // markTaskAsRead,
} from 'actions/task-actions';
// import { UPDATE_TASK_SUCCESS } from 'actions/action-types';
import { openDrawer, closeDrawer } from 'actions/task-drawer-actions';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import {
  selectedTaskSelector,
  taskDrawerOpenSelector,
  taskDrawerFocusFieldSelector,
} from 'selectors/task-drawer-selectors';
import {
  onTaskDrawerTaskDeleted,
  onTaskDrawerTaskDuplicated,
} from 'helpers/ga-event-helper';
import { noop } from 'helpers/utility-functions';
import { checkIfTemplateTask, TaskGroupType } from 'helpers/task-helpers';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { createSingleTaskPath } from 'routing/helpers/paths';
import copy from 'copy-to-clipboard';

const initializeTaskDrawerHooks = ({
  onTaskUpdate,
  onTaskCreation,
  onTaskDelete,
}) => {
  const history = useHistory();
  const { identifier } = useParams();

  const dispatch = useDispatch();
  const taskDrawerOpen = useSelector(taskDrawerOpenSelector);
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
  const selectedTask = useSelector(selectedTaskSelector);

  const [selectedParentTask, setSelectedParentTask] = useState(null);

  const previousTaskIdentifierValue = useRef();
  const taskDrawerReference = useRef(null);

  const { taskIdentifier, subTasksCount, subtasks } = selectedTask || {};
  const taskList = selectedTask?.taskList;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const isSubtask = !!selectedTask?.parentTaskIdentifier;
  const parentTask = selectedTask?.parentTask;
  const selectedTaskDueDate = selectedTask?.dueDate;

  const clearFormStates = () => {
    setSelectedParentTask(null);
  };

  const parentBundle = useMemo(
    () =>
      selectedTask?.taskGroups?.find(
        (tg) => tg.groupType === TaskGroupType.BUNDLE,
      ),
    [selectedTask],
  );

  const taskTemplate = selectedTask?.taskTemplate;

  const [parentDescriptionState, setParentDescriptionState] =
    useMentionsEditorState();

  useEffect(() => {
    const unlisten = history.listen(() => {
      dispatch(closeDrawer());
      dispatch(storeAsCurrentTask());
    });

    return () => {
      unlisten();
    };
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
      // TaskApi.getTaskDetails(taskIdentifier).then((task) => {
      //   setSelectedParentTask(task.parentTask || null);
      //   dispatch({ type: UPDATE_TASK_SUCCESS, task });
      // });
    }
    previousTaskIdentifierValue.current = taskIdentifier;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIdentifier, subtasks]);

  useLayoutEffect(() => {
    if (taskIdentifier !== previousTaskIdentifierValue.current) {
      // eslint-disable-next-line no-unused-expressions
      taskDrawerReference?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [taskIdentifier]);

  useLayoutEffect(() => {
    if (selectedParentTask) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tokenizedDescription, description, taskMentions } =
        selectedParentTask;
      if (description) {
        // const newContent = createMentionEntities(
        //   tokenizedDescription,
        //   description,
        //   taskMentions,
        //   false,
        // );
        // setParentDescriptionState(
        //   EditorState.push(parentDescriptionState, newContent),
        // );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentTask]);

  useEffect(() => {
    if (
      taskDrawerOpen &&
      taskList !== undefined &&
      taskListIdentifier &&
      selectedTask?.taskIdentifier
    ) {
      // dispatch(markTaskAsRead(selectedTask?.taskIdentifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier, taskDrawerOpen]);

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
    ({ afterDuplicate, includeAttachments }) =>
      async (event) => {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (selectedTask && selectedTask.taskIdentifier !== undefined) {
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

  const handleUpdateTask = useCallback(
    async (updatedTaskData) => {
      const updatedTask = await dispatch(
        partialUpdateTask(selectedTaskIdentifier, updatedTaskData),
      );
      onTaskUpdate(updatedTask);
      setAutoSaveVisible();
    },
    [dispatch, onTaskUpdate, selectedTaskIdentifier, setAutoSaveVisible],
  );

  const taskDueTime = useMemo(() => {
    const momentDueTime = moment(selectedTaskDueDate || null);
    if (momentDueTime.isValid()) {
      return momentDueTime.format(TIME_12H_FORMAT);
    }
    return null;
  }, [selectedTaskDueDate]);

  const isTemplateTask = useMemo(
    () => checkIfTemplateTask(selectedTask),
    [selectedTask],
  );
  const onClickParentTask = useCallback(
    () =>
      identifier
        ? history.push(createSingleTaskPath(selectedParentTask.identifier))
        : dispatch(storeAsCurrentTask(selectedParentTask)),
    [dispatch, history, identifier, selectedParentTask],
  );

  const handleWorkflowReferenceClick = useCallback(() => {
    dispatch(
      WorkflowDrawerActions.openDrawer(
        isTemplateTask
          ? taskTemplate.identifier
          : parentBundle.taskGroupIdentifier,
      ),
    );
  }, [dispatch, isTemplateTask, parentBundle, taskTemplate]);

  const handleCopyLink = useCallback(() => {
    copy(
      `${window.location.origin}/#${createSingleTaskPath(
        selectedTaskIdentifier,
      )}`,
    );
    dispatch(AlertActions.showGlobalAlert('Url copied to clipboard'));
  }, [dispatch, selectedTaskIdentifier]);

  return {
    closeTaskDrawer,
    handleUpdateTask,
    parentBundle,
    taskTemplate,
    isSubtask,
    isTemplateTask,
    onClickParentTask,
    onDelete,
    onDuplicate,
    openTaskDrawer,
    parentDescriptionState,
    selectedParentTask,
    selectedTask,
    setParentDescriptionState,
    taskDrawerFocusField,
    taskDrawerOpen,
    taskDrawerReference,
    taskDueTime,
    taskListIdentifier,
    handleWorkflowReferenceClick,
    clearFormStates,
    handleCopyLink,
  };
};

export default initializeTaskDrawerHooks;
