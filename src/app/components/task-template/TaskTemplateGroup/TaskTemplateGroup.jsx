/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import { TaskStatus } from 'helpers/task-helpers';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import TaskTemplateGroupHeader from '../TaskTemplateGroupHeader/TaskTemplateGroupHeader';
import {
  TaskTemplateGroupContainer,
  TaskTemplateGroupList,
  QuickAddInputWrapper,
} from './styled';

const TaskTemplateGroup = ({
  templateGroup = {},
  groupHasMultipleAssignees,
  isFullView,
  isStartedDnD,
  draggableProvided = {},
  groupDragAndDropDisabled,
  tasksDragAndDropDisabled,
  disablePatientAssignment,
  isCompletedTab = false,
  viewSetup,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    tasks,
    identifier,
    patient,
    parentTaskGroupIdentifier,
    taskListIdentifier,
  } = templateGroup;
  const { SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS } = viewSetup;
  const { innerRef, draggableProps } = draggableProvided;
  const [isOpen, setOpen] = useState(true);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(
    !isCompletedTab,
  );
  const [isAddingTask, setIsAddingTask] = useState(false);
  const patientReference = useRef(null);
  const dispatch = useDispatch();

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

  const handleAddBundleTask = useCallback(
    task => {
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

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        isCompletedTab
          ? task => showIncompleteTasks || task.status === TaskStatus.COMPLETE
          : task => showCompletedTasks || task.status !== TaskStatus.COMPLETE,
      ),
    [showCompletedTasks, showIncompleteTasks, tasks, isCompletedTab],
  );

  const openPatientPopover = useCallback(() => {
    if (!disablePatientAssignment && patientReference.current)
      patientReference.current.click();
  }, [disablePatientAssignment]);

  return (
    <TaskTemplateGroupContainer ref={innerRef} {...draggableProps}>
      <TaskTemplateGroupHeader
        templateGroup={templateGroup}
        groupHasMultipleAssignees={groupHasMultipleAssignees}
        draggableProvided={draggableProvided}
        groupDragAndDropDisabled={groupDragAndDropDisabled}
        disablePatientAssignment={disablePatientAssignment}
        isCompletedTab={isCompletedTab}
        viewSetup={viewSetup}
        setIsAddingTask={setIsAddingTask}
      />
      {!isStartedDnD && (
        <TaskTemplateGroupList timeout={150} in={isOpen && !isStartedDnD}>
          <DragDropContext
            onBeforeCapture={({ draggableId: id }) =>
              setDraggedTaskIdentifier(id)
            }
            onDragEnd={dragEndData => {
              setDraggedTaskIdentifier(null);

              if (dragEndData.destination) {
                dispatch(
                  TemplateBundleActions.reorderSubtasksInTemplateBundle({
                    ...dragEndData,
                    bundle: templateGroup,
                    completedTasksShown: showCompletedTasks,
                    incompleteTasksShown: showIncompleteTasks,
                  }),
                );
              }
            }}
          >
            <Droppable droppableId={templateGroup.identifier}>
              {templateDroppableProvided => (
                <div
                  ref={templateDroppableProvided.innerRef}
                  {...templateDroppableProvided.droppableProps}
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task.taskIdentifier}
                      draggableId={task.taskIdentifier}
                      index={index}
                    >
                      {(templateTaskDraggableProvided, draggableSnapshot) => (
                        <StandardTaskItemContainer
                          isStartedDnD={
                            draggedTaskIdentifier === task.taskIdentifier
                          }
                          isDragging={draggableSnapshot.isDragging}
                          draggableProvided={templateTaskDraggableProvided}
                          task={task}
                          isFullView={isFullView}
                          multipleAssigneesContext={groupHasMultipleAssignees}
                          dragAndDropDisabled={tasksDragAndDropDisabled}
                          isDraggable
                          isBundleTask
                          templateBundleIdentifier={identifier}
                          parentTaskGroupIdentifier={parentTaskGroupIdentifier}
                          openPatientPopover={openPatientPopover}
                          noMargin
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
                validator={value => {
                  if ([...value]?.filter(char => char !== ' ').length < 2)
                    return 'The task description is too short (min. 2 characters)';

                  return null;
                }}
              />
            </QuickAddInputWrapper>
          )}
        </TaskTemplateGroupList>
      )}
    </TaskTemplateGroupContainer>
  );
};

export default TaskTemplateGroup;
