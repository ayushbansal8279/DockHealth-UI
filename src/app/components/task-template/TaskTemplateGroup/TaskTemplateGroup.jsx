/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { TaskStatus } from 'helpers/task-helpers';
import {
  taskLookupSelector,
  multipleTaskLookupSelector,
} from 'selectors/task-details-selectors';
import {
  TaskTemplateGroupContainer,
  TaskTemplateGroupList,
  QuickAddInputWrapper,
} from './styled';
import TaskTemplateGroupHeader from '../TaskTemplateGroupHeader/TaskTemplateGroupHeader';

const TaskTemplateGroup = ({
  templateGroup: pullGroup = {},
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
  highlightedValue,
}) => {
  const templateGroup = useSelector((state) => {
    return taskLookupSelector(state, origin, pullGroup);
  });

  // console.log("templateGroup", templateGroup, origin, pullGroup);

  const {
    tasks: taskIdentifiers, // task identifiers
    identifier,
    patient,
    parentTaskGroupIdentifier,
    taskListIdentifier,
    isFetchingTasks,
  } = templateGroup ?? {};

  const tasks = useSelector((state) => {
    return taskIdentifiers
      ? multipleTaskLookupSelector(state, origin, taskIdentifiers)
      : [];
  });

  const { SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS } =
    viewSetup || {};
  // const { innerRef, draggableProps } = draggableProvided;
  const [isOpen, setOpen] = useState(false);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(
    !isCompletedTab,
  );
  const [isAddingTask, setIsAddingTask] = useState(false);
  const dispatch = useDispatch();
  const previousIsOpen = usePrevious(isOpen);

  const currentUser = useSelector(userProfileSelector);
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  useEffect(() => {
    setOpen(SHOW_WORKFLOW_DETAILS);
    if (isCompletedTab) {
      setShowIncompleteTasks(SHOW_WORKFLOW_COMPLETED_TASKS);
      setShowCompletedTasks(true);
    } else {
      setShowIncompleteTasks(true);
      setShowCompletedTasks(SHOW_WORKFLOW_COMPLETED_TASKS);
    }
  }, [SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS, isCompletedTab]);

  useEffect(() => {
    if (isOpen && !previousIsOpen && (!tasks || tasks.length === 0)) {
      dispatch(TemplateBundleActions.getTasksForWorkflow(identifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tasks]);

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
        isCompletedTab
          ? (task) => showIncompleteTasks || task.status === TaskStatus.COMPLETE
          : (task) => showCompletedTasks || task.status !== TaskStatus.COMPLETE,
      ),
    [showCompletedTasks, showIncompleteTasks, tasks, isCompletedTab],
  );

  const filteredTasks = filteredTasksByStatus.map((t) => t.identifier);

  return (
    <TaskTemplateGroupContainer
    // ref={innerRef} {...draggableProps}
      data-foo={1}
    >
      <TaskTemplateGroupHeader
        isFetchingTasks={isFetchingTasks}
        templateGroup={templateGroup}
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
      />
      {!isStartedDnD && window.disabledVirtualTaskList && (
        <TaskTemplateGroupList timeout={150} in={isOpen && !isStartedDnD}>
          {isFetchingTasks ? (
            <TasksSkeletonLoader rows={3} />
          ) : (
            <>
              <DragDropContext
                onBeforeCapture={({ draggableId: id }) =>
                  setDraggedTaskIdentifier(id)
                }
                onDragEnd={({ source, destination }) => {
                  setDraggedTaskIdentifier(null);

                  if (destination) {
                    dispatch(
                      WorkflowActions.reorderWorkflowTasks({
                        source,
                        destination,
                        workflow: templateGroup,
                        completedTasksShown: showCompletedTasks,
                        incompleteTasksShown: showIncompleteTasks,
                      }),
                    );
                  }
                }}
              >
                <Droppable
                  droppableId={templateGroup?.identifier || templateGroup}
                >
                  {(templateDroppableProvided) => (
                    <div
                      ref={templateDroppableProvided.innerRef}
                      {...templateDroppableProvided.droppableProps}
                      data-foo={2}
                    >
                      {filteredTasks?.map((taskOrIdentifier, index) => (
                        <Draggable
                          key={taskOrIdentifier?.identifier || taskOrIdentifier}
                          draggableId={
                            taskOrIdentifier?.identifier || taskOrIdentifier
                          }
                          index={index}
                          isDragDisabled={restrictions?.createTask === DISABLED}
                        >
                          {(
                            templateTaskDraggableProvided,
                            draggableSnapshot,
                          ) => (
                            <StandardTaskItemContainer
                              isStartedDnD={
                                draggedTaskIdentifier ===
                                (taskOrIdentifier?.identifier ||
                                  taskOrIdentifier)
                              }
                              isDragging={draggableSnapshot.isDragging}
                              draggableProvided={templateTaskDraggableProvided}
                              taskIdentifier={
                                taskOrIdentifier?.identifier || taskOrIdentifier
                              }
                              isFullView={isFullView}
                              isCompletedGroup={isCompletedGroup}
                              multipleAssigneesContext={
                                groupHasMultipleAssignees
                              }
                              dragAndDropDisabled={tasksDragAndDropDisabled}
                              isDraggable
                              isBundleTask
                              templateBundleIdentifier={identifier}
                              parentTaskGroupIdentifier={
                                parentTaskGroupIdentifier
                              }
                              noMargin
                              iconColorActive={iconColorActive}
                              origin={origin}
                            />
                          )}
                        </Draggable>
                      ))}
                      {templateDroppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {isAddingTask && (
                <QuickAddInputWrapper>
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
                    iconColorActive={iconColorActive}
                  />
                </QuickAddInputWrapper>
              )}
            </>
          )}
        </TaskTemplateGroupList>
      )}
    </TaskTemplateGroupContainer>
  );
};

export default TaskTemplateGroup;
