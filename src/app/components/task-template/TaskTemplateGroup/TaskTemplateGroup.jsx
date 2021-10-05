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
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ThreeDotsIcon from 'img/three-dots';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHoriz } from '@material-ui/icons';
import * as ModalActions from 'modal/actions';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import { TaskStatus } from 'helpers/task-helpers';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ProgressBar from 'components/common/ProgressBar/ProgressBar';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import OverflowTooltip from 'components/task/OverflowTooltip/OverflowTooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import PatientList from 'components/patients/PatientDropdown/PatientList';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
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
  isCompletedTab = false,
  viewSetup,
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
  const { SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS } = viewSetup;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const [isOpen, setOpen] = useState(true);
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(
    !isCompletedTab,
  );
  const [isAddingTask, setIsAddingTask] = useState(false);
  const patientReference = useRef(null);

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

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

  useEffect(() => {
    setNameInputValue(name);
  }, [name]);

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

  const toggleTasksVisibility = useCallback(() => {
    return isCompletedTab
      ? setShowIncompleteTasks(!showIncompleteTasks)
      : setShowCompletedTasks(!showCompletedTasks);
  }, [
    isCompletedTab,
    setShowIncompleteTasks,
    setShowCompletedTasks,
    showCompletedTasks,
    showIncompleteTasks,
  ]);

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

    if (isCompletedTab ? !showIncompleteTasks : !showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: isCompletedTab
            ? 'Show incomplete tasks'
            : 'Show completed tasks',
          onClick: toggleTasksVisibility,
        },
      ];
    }

    if (isCompletedTab ? showIncompleteTasks : showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: isCompletedTab
            ? 'Hide incomplete tasks'
            : 'Hide completed tasks',
          onClick: toggleTasksVisibility,
        },
      ];
    }

    return [
      ...opts,
      {
        name: 'Delete',
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete workflow',
              description:
                'Are you sure you want to delete this workflow? This action cannot be undone.',
              confirm: () => {
                dispatch(
                  TemplateBundleActions.deleteTemplateBundle(identifier),
                );
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
      },
    ];
  }, [
    dispatch,
    identifier,
    showCompletedTasks,
    showIncompleteTasks,
    isCompletedTab,
    toggleTasksVisibility,
  ]);

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
        const { value } = event.target;
        if (value?.length > 1) {
          setNameInputError(false);
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
        } else {
          setNameInputError(true);
        }
      } else if (key === 'Escape') {
        setNameInputError(false);
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, templateGroup],
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

  const openPatientPopover = useCallback(() => {
    if (!disablePatientAssignment && patientReference.current)
      patientReference.current.click();
  }, [disablePatientAssignment]);

  const handlePatientSelect = useCallback(
    newPatient => {
      const patientName = newPatient?.lastName
        ? `${newPatient?.lastName}, ${newPatient?.firstName}`
        : newPatient?.firstName;
      if (patient) {
        dispatch(
          ModalActions.openModal(
            newPatient ? 'AssignPatient' : 'UnassignPatient',
            {
              isWorkflowModal: true,
              confirm: () => {
                dispatch(
                  TemplateBundleActions.changePatientForTemplateBundle(
                    identifier,
                    newPatient,
                  ),
                );
              },
              patientName,
            },
          ),
        );
      } else {
        dispatch(
          TemplateBundleActions.changePatientForTemplateBundle(
            identifier,
            newPatient,
          ),
        );
      }
    },
    [dispatch, identifier, patient],
  );

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
          <NameContainer
            onClick={() => {
              if (!isEditing) {
                setOpen(!isOpen);
              }
            }}
          >
            <TaskTemplateNameInput
              ref={nameInputReference}
              readOnly={!isEditing}
              error={nameInputError}
              onChange={event => {
                setNameInputValue(event.target?.value);
                setNameInputError(false);
              }}
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
              <TaskItemPopover
                ref={patientReference}
                fullWidth
                contentWidth={330}
                content={({ closePopover }) => (
                  <PatientList
                    onSelect={newPatient => {
                      handlePatientSelect(newPatient);
                      closePopover();
                    }}
                    selectedPatientIdentifier={
                      patient ? patient.patientIdentifier : null
                    }
                    isMultipleChange
                    closePopover={closePopover}
                  />
                )}
              >
                {({ isPopoverOpen }) => (
                  <>
                    {patient ? (
                      <PatientCard
                        patientIdentifier={patient.patientIdentifier}
                        disabled={isPopoverOpen}
                      >
                        <Link
                          to={`/core/patient/${patient?.patientIdentifier}`}
                        >
                          <Placeholder>
                            {patient?.lastName
                              ? `${patient?.lastName}, ${patient?.firstName}`
                              : patient?.firstName}
                          </Placeholder>
                        </Link>
                      </PatientCard>
                    ) : (
                      <AddPlaceholder>
                        + Add {customerTypeLabelCapitalized}
                      </AddPlaceholder>
                    )}
                  </>
                )}
              </TaskItemPopover>
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
              <MoreHoriz fontSize="large" color="primary" />
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
                          taskItemConfig={taskItemConfig}
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
