/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { Box } from '@material-ui/core';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import { pluck } from 'ramda';
import {
  checkIfHasIncompleteTasks,
  extractTasksAndSubtasks,
} from 'helpers/tasklist-helpers';
import { useDispatch } from 'react-redux';
import ThreeDotsIcon from 'img/three-dots';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHoriz } from '@material-ui/icons';
import * as ModalActions from 'modal/actions';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import palette from 'styles/palette';
import { TaskStatus } from 'helpers/task-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ProgressBar from 'components/common/ProgressBar/ProgressBar';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import OverflowTooltip from 'components/task/OverflowTooltip/OverflowTooltip';
import PatientDropdown from 'components/patients/PatientDropdown/PatientDropdown';
import {
  TaskTemplateGroupContainer,
  TaskTemplateGroupHeader,
  TaskTemplateGroupHeaderContainer,
  TaskTemplateGroupList,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
  TaskTemplateNameInput,
  TaskTemplatePatientHeader,
  AddPlaceholder,
  Placeholder,
  TaskTemplateRight,
  NameContainer,
  NameTooltip,
  QuickAddInputWrapper,
} from './styled';

const TaskTemplateGroup = ({
  templateGroup = {},
  taskItemConfig,
  groupHasMultipleAssignees,
  isFullView,
  isStartedDnD,
  draggableProvided = {},
  groupDragAndDropDisabled,
  tasksDragAndDropDisabled,
  disablePatientAssignment,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    name,
    tasks,
    identifier,
    patient,
    parentTaskGroupIdentifier,
    taskListIdentifier,
  } = templateGroup;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const [isOpen, setOpen] = useState(true);
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const nameInputReference = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setNameInputValue(name);
  }, [name]);

  useEffect(() => {
    if (tasks && !checkIfHasIncompleteTasks(tasks)) {
      setTimeout(() => {
        dispatch(TemplateBundleActions.completeTemplateBundle(identifier));
      }, TASK_DISAPPEAR_DELAY);
    }
  }, [dispatch, identifier, tasks]);

  const [completedTasksAmount, allTasksAmount] = useMemo(
    () =>
      tasks.reduce(
        (accumulator, currentTask) => {
          if (currentTask.status === TaskStatus.COMPLETE) {
            accumulator[0] += 1;
          }

          accumulator[0] += currentTask?.subTasksCompletedCount;
          accumulator[1] =
            accumulator[1] + (currentTask?.subTasksCount || 0) + 1;

          return accumulator;
        },
        [0, 0],
      ),
    [tasks],
  );

  const menuOptions = useMemo(() => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    let opts = [
      {
        name: 'Add Task',
        onClick: () => {
          setIsAddingTask(true);
        },
      },
      {
        name: 'Edit Name',
        onClick: () => {
          setIsEditing(true);
          setTimeout(() => {
            // eslint-disable-next-line no-unused-expressions
            nameInputReference.current?.focus();
          }, 0);
        },
      },
      {
        name: 'Duplicate',
        onClick: () =>
          dispatch(
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () => {
                dispatch(
                  TemplateBundleActions.duplicateTemplateBundle(
                    identifier,
                    true,
                  ),
                );
              },
              skip: () => {
                dispatch(
                  TemplateBundleActions.duplicateTemplateBundle(
                    identifier,
                    false,
                  ),
                );
              },
            }),
          ),
      },
      {
        name: 'Move',
        onClick: () =>
          dispatch(
            ModalActions.openModal('SelectDestination', {
              confirmText: 'Move',
              confirm: ({
                taskListIdentifier: listIdentifier,
                taskGroupIdentifier,
              }) => {
                dispatch(
                  TemplateBundleActions.moveTemplateBundle({
                    bundleIdentifier: identifier,
                    taskListIdentifier: listIdentifier,
                    taskGroupIdentifier,
                  }),
                );
              },
            }),
          ),
      },
    ];

    if (!showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: 'Show completed tasks',
          onClick: () => setShowCompletedTasks(true),
        },
      ];
    }

    if (showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: 'Hide completed tasks',
          onClick: () => setShowCompletedTasks(false),
        },
      ];
    }

    return [
      ...opts,
      {
        name: 'Delete',
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteTemplate', {
              confirm: () =>
                dispatch(
                  TemplateBundleActions.deleteTemplateBundle(identifier),
                ),
            }),
          ),
      },
    ];
  }, [dispatch, identifier, showCompletedTasks]);

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

  const handleNameInputKeyDown = useCallback(
    event => {
      const { key } = event;
      if (key === 'Enter') {
        dispatch(
          TemplateBundleActions.updateTemplateBundle({
            bundle: templateGroup,
            dataToUpdate: {
              name: event.target?.value,
            },
          }),
        );
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      } else if (key === 'Escape') {
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, templateGroup],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        task => showCompletedTasks || task.status !== TaskStatus.COMPLETE,
      ),
    [showCompletedTasks, tasks],
  );

  const isBundleSelected = useMemo(
    () => checkIfAllTasksSelected(filteredTasks),
    [filteredTasks],
  );

  const handleBundleSelect = useCallback(() => {
    const { parentTasks, subtasks } = extractTasksAndSubtasks(filteredTasks);

    const allTasks = [...parentTasks, ...subtasks];
    dispatch(
      TaskActions.changeTasksSelectedState(
        !isBundleSelected,
        pluck('identifier', allTasks),
      ),
    );
  }, [dispatch, isBundleSelected, filteredTasks]);

  return (
    <TaskTemplateGroupContainer ref={innerRef} {...draggableProps}>
      <TaskTemplateGroupHeaderContainer>
        {!groupDragAndDropDisabled && !bulkEditIsActive && (
          <TemplateHandle
            src={ThreeDotsIcon}
            alt="Handle"
            {...dragHandleProps}
          />
        )}
        <TaskTemplateGroupHeader>
          <Checkbox isChecked={isBundleSelected} onClick={handleBundleSelect} />
          <Box m={1} />
          <RotatableChevron rotated={isOpen} onClick={() => setOpen(!isOpen)} />
          <NameContainer>
            <TaskTemplateNameInput
              ref={nameInputReference}
              readOnly={!isEditing}
              disabled={!isEditing}
              onChange={event => setNameInputValue(event.target?.value)}
              onBlur={() => {
                setIsEditing(false);
                setNameInputValue(name);
              }}
              onKeyDown={handleNameInputKeyDown}
              value={nameInputValue}
            />
            <OverflowTooltip textReference={nameInputReference.current}>
              <NameTooltip>{name}</NameTooltip>
            </OverflowTooltip>
          </NameContainer>
        </TaskTemplateGroupHeader>
        <TaskTemplateRight>
          {!disablePatientAssignment && (
            <TaskTemplatePatientHeader>
              <PatientDropdown
                selectedPatientIdentifier={
                  patient ? patient.patientIdentifier : null
                }
                isPopoverOpen={isPopoverOpen}
                onChangePatient={patientIdentifier =>
                  dispatch(
                    TemplateBundleActions.changePatientForTemplateBundle(
                      identifier,
                      parentTaskGroupIdentifier,
                      patientIdentifier,
                    ),
                  )
                }
                openPopover={() => setPopoverOpen(true)}
                closePopover={() => setPopoverOpen(false)}
                isMultipleChange
              >
                {patient ? (
                  <PatientCard patientIdentifier={patient.patientIdentifier}>
                    <Placeholder>
                      {patient?.lastName
                        ? `${patient?.lastName}, ${patient?.firstName}`
                        : patient?.firstName}
                    </Placeholder>
                  </PatientCard>
                ) : (
                  <AddPlaceholder>+ Add Patient</AddPlaceholder>
                )}
              </PatientDropdown>
            </TaskTemplatePatientHeader>
          )}
          <TaskTemplateOptionsContainer
            groupHasMultipleAssignees={groupHasMultipleAssignees}
          >
            <TaskTemplateProgressCircle>
              <ProgressBar
                progress={(completedTasksAmount / allTasksAmount) * 100}
                label={`${completedTasksAmount}/${allTasksAmount}`}
              />
            </TaskTemplateProgressCircle>
            <OptionsMenu options={menuOptions}>
              <MoreHoriz
                fontSize="large"
                color="inherit"
                style={{ color: palette.coolGrey1 }}
              />
            </OptionsMenu>
          </TaskTemplateOptionsContainer>
        </TaskTemplateRight>
      </TaskTemplateGroupHeaderContainer>
      {!isStartedDnD && (
        <TaskTemplateGroupList timeout={150} in={isOpen && !isStartedDnD}>
          <DragDropContext
            onBeforeCapture={({ draggableId: id }) =>
              setDraggedTaskIdentifier(id)
            }
            onDragEnd={dragEndData => {
              setDraggedTaskIdentifier(null);
              dispatch(
                TemplateBundleActions.reorderSubtasksInTemplateBundle({
                  ...dragEndData,
                  bundle: templateGroup,
                  completedTasksShown: showCompletedTasks,
                }),
              );
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
                          taskItemConfig={taskItemConfig}
                          isFullView={isFullView}
                          multipleAssigneesContext={groupHasMultipleAssignees}
                          dragAndDropDisabled={tasksDragAndDropDisabled}
                          isDraggable
                          isBundleTask
                          templateBundleIdentifier={identifier}
                          parentTaskGroupIdentifier={parentTaskGroupIdentifier}
                          openPatientPopover={
                            disablePatientAssignment
                              ? () => {}
                              : () => setPopoverOpen(true)
                          }
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
              />
            </QuickAddInputWrapper>
          )}
        </TaskTemplateGroupList>
      )}
    </TaskTemplateGroupContainer>
  );
};

export default TaskTemplateGroup;
