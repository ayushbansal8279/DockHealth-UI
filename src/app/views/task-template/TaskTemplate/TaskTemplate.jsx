/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pluck } from 'ramda';
import { useHistory } from 'react-router-dom';
import palette from 'styles/palette';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { createTaskTemplateDetailsPath } from 'routing/helpers/paths';
import { Collapse } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { onTaskOrderChanged } from 'helpers/ga-event-helper';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import {
  taskTemplateDetailsSelector,
  parentFolderIdSelector,
} from 'selectors/task-template-selectors';
import { userHasSmartFlowsSelector } from 'selectors/user-selectors';
import * as TaskTemplateActions from 'actions/task-template-actions';
import * as ModalActions from 'modal/actions';
import * as TaskActions from 'actions/task-actions';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { TaskItemColumn } from 'helpers/task-helpers';
import { moveTemplate } from 'actions/task-template-actions';
import * as ActionTypes from 'actions/action-types';
import SmartFlowIcon from 'img/template/smartflow.svg';
import {
  TaskTemplateContainer,
  TaskTemplateHeader,
  NameInput,
  Description,
  ArrowButton,
  MenuContainer,
  QuickAddInputWrapper,
  ArrowButtonContainer,
  SmartFlowIndicatorContainer,
  SmartFlowButton,
  SmartFlowIndicatorIcon,
  CheckboxPlaceholder,
  Spacer,
} from './styled';

const TEMPLATES_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.DUE_DATE]: false,
};

const TaskTemplate = ({ template, isFullView, children }) => {
  const {
    taskTemplateIdentifier,
    name,
    description,
    type,
    publicAccess = false,
  } = template;
  const smartFlowsAvailable = useSelector(userHasSmartFlowsSelector);

  const [draggableId, setDraggableId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const { isOpen, isFetching, tasks } =
    useSelector(taskTemplateDetailsSelector(taskTemplateIdentifier)) || {};
  const mainListId = useSelector(parentFolderIdSelector);

  useEffect(() => {
    setNameInputValue(name);
    // eslint-disable-next-line no-unused-expressions
    nameInputReference.current?.blur();
  }, [name]);

  const menuOptions = useMemo(
    () => [
      smartFlowsAvailable && {
        name: 'Open in SmartFlow Builder',
        onClick: () =>
          history.push(createTaskTemplateDetailsPath(taskTemplateIdentifier)),
      },
      {
        name: 'Edit Workflow Name',
        onClick: () => {
          setIsEditing(true);
          // eslint-disable-next-line no-unused-expressions
          nameInputReference.current?.focus();
        },
      },
      {
        name: 'Move to folder',
        onClick: () =>
          dispatch(
            ModalActions.openModal('SelectWorkflowDestination', {
              confirmText: 'Move',
              confirm: parentTaskTemplateIdentifier => {
                dispatch(
                  moveTemplate({
                    parentTaskTemplateIdentifier,
                    taskTemplateIdentifier,
                  }),
                );
              },
              onAddFolderCallback: createdFolder => {
                if (mainListId === createdFolder.parentTaskTemplateIdentifier) {
                  dispatch({
                    type: ActionTypes.ADD_TASK_TEMPLATE,
                    template: createdFolder,
                  });
                }
              },
            }),
          ),
      },
      {
        name: 'Duplicate Workflow',
        onClick: () =>
          dispatch(
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () =>
                dispatch(
                  TaskTemplateActions.duplicateTemplate(
                    taskTemplateIdentifier,
                    true,
                  ),
                ),
              skip: () =>
                dispatch(
                  TaskTemplateActions.duplicateTemplate(
                    taskTemplateIdentifier,
                    false,
                  ),
                ),
            }),
          ),
      },
      {
        name: publicAccess ? 'Make Private' : 'Make Public',
        onClick: () => {
          dispatch(
            TaskTemplateActions.switchTemplatePublic(
              taskTemplateIdentifier,
              !publicAccess,
            ),
          );
        },
      },
      {
        name: 'Delete Workflow',
        color: palette.oPlusRed,
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete workflow',
              description:
                'Are you sure you want to delete this workflow? This action cannot be undone.',
              confirm: () => {
                dispatch(
                  TaskTemplateActions.deleteTemplate(taskTemplateIdentifier),
                );
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
      },
    ],
    [
      smartFlowsAvailable,
      history,
      taskTemplateIdentifier,
      dispatch,
      mainListId,
      publicAccess,
    ],
  );

  const handleNameInputKeyDown = useCallback(
    event => {
      const {
        key,
        target: { value },
      } = event;
      if (key === 'Enter') {
        if (value?.length > 1) {
          setNameInputError(false);
          dispatch(
            TaskTemplateActions.updateTemplate(taskTemplateIdentifier, {
              name: value,
            }),
          );
        } else {
          setNameInputError(true);
        }
      } else if (key === 'Escape') {
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, taskTemplateIdentifier],
  );

  const handleAddTaskToTemplate = useCallback(
    task => {
      dispatch(
        TaskTemplateActions.addTaskToTemplate({
          ...task,
          taskTemplateIdentifier,
        }),
      );
    },
    [dispatch, taskTemplateIdentifier],
  );

  const onBeforeCapture = useCallback(({ draggableId: id }) => {
    setDraggableId(id);
  }, []);

  const onDragEnd = useCallback(
    ({ destination, source }) => {
      setDraggableId(null);
      onTaskOrderChanged();

      dispatch(
        TaskTemplateActions.reorderTasksForTemplate({
          taskTemplateIdentifier,
          source,
          destination,
        }),
      );
    },
    [dispatch, taskTemplateIdentifier],
  );

  const containsMultipleAssignees = useMemo(
    () =>
      tasks?.some(
        // eslint-disable-next-line no-shadow
        ({ assignedToUsers, subtasks }) =>
          (assignedToUsers && assignedToUsers.length > 1) ||
          (subtasks &&
            subtasks.length > 0 &&
            subtasks.some(
              ({ assignedToUsers: subtaskAssignedToUsers }) =>
                subtaskAssignedToUsers && subtaskAssignedToUsers.length > 1,
            )),
      ),
    [tasks],
  );

  const isTemplateSelected = useMemo(() => checkIfAllTasksSelected(tasks), [
    tasks,
  ]);

  const handleTemplateSelect = useCallback(() => {
    const { parentTasks, subtasks } = extractTasksAndSubtasks(tasks);
    const allTasks = [...parentTasks, ...subtasks];
    dispatch(
      TaskActions.changeTasksSelectedState(
        !isTemplateSelected,
        pluck('identifier', allTasks),
      ),
    );
  }, [dispatch, isTemplateSelected, tasks]);

  const onArrowClick = () => {
    if (isOpen) {
      dispatch(TaskActions.unselectAllTasks());
    }
    dispatch(TaskTemplateActions.toggleTemplateOpen(taskTemplateIdentifier));
  };

  const onSmartFlowClick = () => {
    history.push(createTaskTemplateDetailsPath(taskTemplateIdentifier));
  };

  const onChangeName = event => {
    setNameInputValue(event.target?.value);
    setNameInputError(false);
  };

  const onBlurName = () => {
    setIsEditing(false);
    setNameInputValue(name);
  };

  return (
    <TaskTemplateContainer>
      <TaskTemplateHeader>
        {type === 'WORKFLOW' && (
          <Checkbox
            isDisabled={!isOpen}
            isChecked={isTemplateSelected}
            onClick={handleTemplateSelect}
          />
        )}
        {type === 'SMARTFLOW' && <CheckboxPlaceholder />}
        {type === 'WORKFLOW' && (
          <ArrowButtonContainer>
            <ArrowButton onClick={onArrowClick}>
              <RotatableChevron rotated={isOpen} />
            </ArrowButton>
          </ArrowButtonContainer>
        )}
        {type === 'SMARTFLOW' && (
          <Tooltip placement="top" title="A SmartFlow">
            <SmartFlowIndicatorContainer>
              <SmartFlowButton onClick={onSmartFlowClick}>
                <SmartFlowIndicatorIcon src={SmartFlowIcon} alt="SmartFlow" />
              </SmartFlowButton>
            </SmartFlowIndicatorContainer>
          </Tooltip>
        )}
        <NameInput
          ref={nameInputReference}
          readOnly={!isEditing}
          error={nameInputError}
          onChange={onChangeName}
          onBlur={onBlurName}
          onKeyDown={handleNameInputKeyDown}
          onClick={
            !isEditing &&
            (type === 'SMARTFLOW' ? onSmartFlowClick : onArrowClick)
          }
          value={nameInputValue}
        />
        {children}
        <Spacer />
        <OptionsMenu options={menuOptions}>
          <MenuContainer size="small">
            <MoreHoriz fontSize="large" color="inherit" />
          </MenuContainer>
        </OptionsMenu>
        {description && <Description>{description}</Description>}
      </TaskTemplateHeader>
      <Collapse in={isOpen}>
        <>
          {!isFetching ? (
            <>
              <DragDropContext
                onBeforeCapture={onBeforeCapture}
                onDragEnd={onDragEnd}
              >
                <Droppable droppableId="droppable">
                  {droppableProvided => (
                    <div
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      {tasks?.map((task, index) => {
                        return (
                          <Draggable
                            key={task.taskIdentifier}
                            draggableId={task.taskIdentifier}
                            index={index}
                          >
                            {(draggableProvided, draggableSnapshot) => (
                              <StandardTaskItemContainer
                                isStartedDnD={
                                  draggableId === task.taskIdentifier
                                }
                                isDragging={draggableSnapshot.isDragging}
                                draggableProvided={draggableProvided}
                                isDraggable
                                task={task}
                                taskItemConfig={TEMPLATES_VIEW_COLUMNS_CONFIG}
                                isFullView={isFullView}
                                multipleAssigneesContext={
                                  containsMultipleAssignees
                                }
                                noMargin
                              />
                            )}
                          </Draggable>
                        );
                      })}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <QuickAddInputWrapper>
                <QuickAddTaskInput
                  disableMentions
                  quickAddTask={handleAddTaskToTemplate}
                />
              </QuickAddInputWrapper>
            </>
          ) : (
            <TasksSkeletonLoader rows={4} />
          )}
        </>
      </Collapse>
    </TaskTemplateContainer>
  );
};

export default TaskTemplate;
