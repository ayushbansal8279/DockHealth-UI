/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePrevious from 'hooks/use-previous';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import * as WorkflowActions from 'actions/workflow-actions';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
// eslint-disable-next-line import/no-cycle
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { TaskStatus, TaskOrigin } from 'helpers/task-helpers';
import {
  taskLookupSelector,
  multipleTaskLookupSelector,
} from 'selectors/task-details-selectors';
import { currentTaskListTasksStatusSelector } from 'selectors/task-list-selectors';
import { currentListTasksStatusSelector } from 'selectors/patient-details-selectors';
import { TaskTemplateGroupList, QuickAddInputWrapper } from './styled';
import TaskTemplateGroupHeader from '../TaskTemplateGroupHeader/TaskTemplateGroupHeader';
import localStorageHelper from '@/app/helpers/local-storage-helper';
import { WorkflowCompletedTasksKey } from '@/app/helpers/patient-details-helpers';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DropDirectionContext } from '@/app/context-api/DropDirectionContext';
import TaskItem from '../../task/StandardTaskItem/TaskItem';

const TaskTemplateGroup = ({
  templateGroup: pullGroup = {},
  patient: parentPatient,
  groupHasMultipleAssignees,
  isFullView,
  isCompletedGroup,
  isStartedDnD,
  dragHandleProps = {},
  groupDragAndDropDisabled,
  tasksDragAndDropDisabled,
  disablePatientAssignment,
  isCompletedTab = false,
  viewSetup,
  showTasksWithGroup = true,
  iconColorActive,
  origin,
  pageBackground,
  highlightedValue,
  isNextVirtualTaskItemTypeBundle,
  isLastTaskOfGroup,
  isFirstTaskOfGroup,
  isNextTaskItemTypeBundle,
  taskGroupIdentifier,
  viewType,
}) => {
  const templateGroup = useSelector((state) => {
    return taskLookupSelector(state, origin, pullGroup);
  });
  const {
    tasks: taskIdentifiers, // task identifiers
    identifier,
    patient: workflowPatient,
    parentTaskGroupIdentifier,
    taskListIdentifier,
    isFetchingTasks,
  } = templateGroup ?? {};

  const patient = parentPatient || workflowPatient;

  const tasks = useSelector((state) => {
    return taskIdentifiers
      ? multipleTaskLookupSelector(state, origin, taskIdentifiers)
      : [];
  });

  // const { SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS } =
  //   viewSetup || {};
  // const { innerRef, draggableProps } = draggableProvided;
  const [isOpen, setOpen] = useState(false);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const dispatch = useDispatch();
  const previousIsOpen = usePrevious(isOpen);
  const dropDirectionRef = useRef(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const currentUser = useSelector(userProfileSelector);
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  const currentTaskListTasksStatus = useSelector(
    currentTaskListTasksStatusSelector,
  );
  const currentPatientTasksStatus = useSelector(currentListTasksStatusSelector);

  const showCompletedWorkflowTaskFlag = localStorageHelper.getItem(
    WorkflowCompletedTasksKey,
  );

  const tasksStatus =
    origin === TaskOrigin.PATIENT
      ? currentPatientTasksStatus
      : currentTaskListTasksStatus;
  // useEffect(() => {
  //   // setOpen(SHOW_WORKFLOW_DETAILS); //no longer supported
  //   if (isCompletedTab) {
  //     setShowIncompleteTasks(SHOW_WORKFLOW_COMPLETED_TASKS);
  //     setShowCompletedTasks(true);
  //   } else {
  //     setShowIncompleteTasks(true);
  //     setShowCompletedTasks(SHOW_WORKFLOW_COMPLETED_TASKS);
  //   }
  // }, [SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS, isCompletedTab]);
  useEffect(() => {
    if (viewType === 'FULL_VIEW') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [viewType]);

  useEffect(() => {
    if (isOpen && !previousIsOpen && (!tasks || tasks.length === 0)) {
      dispatch(TemplateBundleActions.getTasksForWorkflow(identifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tasks, tasksStatus]);

  useEffect(() => {
    switch (tasksStatus) {
      case TaskStatus.COMPLETE: {
        setShowIncompleteTasks(false);
        setShowCompletedTasks(true);
        break;
      }
      case TaskStatus.INCOMPLETE: {
        setShowIncompleteTasks(true);
        setShowCompletedTasks(showCompletedWorkflowTaskFlag ? true : false);
        break;
      }
      case TaskStatus.ALL: {
        setShowIncompleteTasks(true);
        setShowCompletedTasks(true);
        break;
      }
      default:
      // No default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksStatus, showCompletedWorkflowTaskFlag]);

  const handleAddBundleTask = useCallback(
    (task) => {
      const taskData = {
        ...task,
        taskGroupIdentifier: identifier,
        taskListIdentifier,
      };

      if (patient) {
        taskData.patientIdentifier = patient.patientIdentifier;
      }

      dispatch(TaskActions.saveTask(taskData));
    },
    [dispatch, identifier, taskListIdentifier, patient],
  );

  const filteredTasksByStatus = useMemo(
    () =>
      tasks.filter(
        (task) =>
          (showIncompleteTasks && task?.status === TaskStatus.INCOMPLETE) ||
          (showCompletedTasks && task?.status === TaskStatus.COMPLETE) ||
          task?.status === tasksStatus,
      ),
    [tasks, showIncompleteTasks, showCompletedTasks, tasksStatus],
  );

  const filteredTasks = filteredTasksByStatus.map((t) => t.identifier);

  const handleDragStart = (event) => {
    setDraggedTaskIdentifier(event?.active?.id);
    setActiveId(event?.active?.id);
  };

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      const sourceIndex = taskIdentifiers?.findIndex((id) => id === active?.id);
      const destinationIndex = taskIdentifiers?.findIndex(
        (id) => id === over?.id,
      );

      setDraggedTaskIdentifier(null);
      setActiveId(null);

      if (over) {
        dispatch(
          WorkflowActions.reorderWorkflowTasks({
            source: { ...active, index: sourceIndex },
            destination: {
              ...over,
              index:
                dropDirectionRef?.current === 'top'
                  ? 0
                  : sourceIndex <= destinationIndex
                  ? destinationIndex
                  : destinationIndex + 1,
            },
            workflow: templateGroup,
            completedTasksShown: showCompletedTasks,
            incompleteTasksShown: showIncompleteTasks,
          }),
        );
      }
    },
    [dispatch, identifier, taskIdentifiers],
  );

  return (
    <div
    // ref={innerRef} {...draggableProps}
    >
      <TaskTemplateGroupHeader
        isFetchingTasks={isFetchingTasks}
        templateGroup={templateGroup}
        patient={patient}
        templateTasks={tasks}
        groupHasMultipleAssignees={groupHasMultipleAssignees}
        dragHandleProps={dragHandleProps}
        groupDragAndDropDisabled={groupDragAndDropDisabled}
        disablePatientAssignment={disablePatientAssignment}
        isCompletedTab={isCompletedTab}
        viewSetup={viewSetup}
        setIsAddingTask={setIsAddingTask}
        isOpen={isOpen}
        setOpen={setOpen}
        showCompletedTasks={showCompletedTasks}
        setShowCompletedTasks={setShowCompletedTasks}
        showIncompleteTasks={showIncompleteTasks}
        setShowIncompleteTasks={setShowIncompleteTasks}
        showTasksWithGroup={showTasksWithGroup}
        iconColorActive={iconColorActive}
        highlightedValue={highlightedValue}
        origin={origin}
        pageBackground={pageBackground}
        isNextVirtualTaskItemTypeBundle={isNextVirtualTaskItemTypeBundle}
        isLastTaskOfGroup={isLastTaskOfGroup}
        isFirstTaskOfGroup={isFirstTaskOfGroup}
        isNextTaskItemTypeBundle={isNextTaskItemTypeBundle}
        tasksStatus={tasksStatus}
        taskGroupIdentifier={taskGroupIdentifier}
      />
      {!isStartedDnD && window.disabledVirtualTaskList && (
        <TaskTemplateGroupList timeout={150} in={isOpen && !isStartedDnD}>
          {isFetchingTasks ? (
            <TasksSkeletonLoader rows={3} />
          ) : (
            <>
              <DropDirectionContext.Provider value={dropDirectionRef}>
                <DndContext
                  onDragStart={handleDragStart}
                  onDragEnd={onDragEnd}
                  sensors={sensors}
                >
                  {filteredTasks?.map((taskOrIdentifier, index) => (
                    <StandardTaskItemContainer
                      isStartedDnD={
                        draggedTaskIdentifier ===
                        (taskOrIdentifier?.identifier || taskOrIdentifier)
                      }
                      taskIdentifier={
                        taskOrIdentifier?.identifier || taskOrIdentifier
                      }
                      isFullView={isFullView}
                      isCompletedGroup={isCompletedGroup}
                      multipleAssigneesContext={groupHasMultipleAssignees}
                      dragAndDropDisabled={tasksDragAndDropDisabled}
                      isDraggable
                      isBundleTask
                      isTaskTemplate
                      isLastChild={
                        index === filteredTasks?.length - 1 && !isAddingTask
                      }
                      isAddingTask={isAddingTask}
                      isNextTaskItemTypeBundle={isNextTaskItemTypeBundle}
                      templateBundleIdentifier={identifier}
                      parentTaskGroupIdentifier={parentTaskGroupIdentifier}
                      patient={patient}
                      noMargin
                      iconColorActive={iconColorActive}
                      origin={origin}
                      viewType={viewType}
                      isWorkflowTask
                      isFirstTaskOfWorkflow={index === 0}
                    />
                  ))}
                  <DragOverlay>
                    {activeId ? (
                      <Placeholder taskIdentifier={activeId} origin={origin} />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </DropDirectionContext.Provider>
              {isAddingTask && (
                <QuickAddInputWrapper
                  isNextTaskItemTypeBundle={isNextTaskItemTypeBundle}
                  isAddingTask={isAddingTask}
                  origin={origin}
                >
                  <QuickAddTaskInput
                    autofocus
                    disableMentions
                    quickAddTask={handleAddBundleTask}
                    onBlur={() => setIsAddingTask(false)}
                    validator={(value) => {
                      if ([...value]?.filter((char) => char !== ' ').length < 2)
                        return 'The task description is too short (min. 2 characters)';

                      return null;
                    }}
                    isWorkflowAddTaskRow={isAddingTask}
                    iconColorActive={iconColorActive}
                  />
                </QuickAddInputWrapper>
              )}
            </>
          )}
        </TaskTemplateGroupList>
      )}
    </div>
  );
};

const Placeholder = ({ taskIdentifier, origin }) => {
  return (
    // @ts-ignore
    <TaskItem
      taskItemIdentifier={taskIdentifier}
      isDragPreview
      origin={origin}
    />
  );
};

export default TaskTemplateGroup;
