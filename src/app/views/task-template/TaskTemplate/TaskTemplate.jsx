/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import palette from 'styles/palette';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { createWorkflowBuilderPath } from 'routing/helpers/paths';
import { Collapse } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { onTaskOrderChanged } from 'helpers/ga-event-helper';
import {
  taskTemplateDetailsSelector,
  currentFolderIdentifierSelector,
} from 'selectors/task-template-selectors';
import {
  userHasSmartFlowsSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import * as WorkflowActions from 'actions/workflow-actions';
import * as ModalActions from 'modal/actions';
import * as TaskActions from 'actions/task-actions';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { isTaskItemsSelectedSelector } from 'selectors/task-items-selectors';
import { TaskOrigin } from 'helpers/task-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import {
  moveWorkflowToFolder,
  copyWorkflowToOrganization,
  switchTemplatePublic,
  updatePartialWorkflow,
  addTaskToTemplate,
  reorderTasksForTemplate,
  toggleTemplateOpen,
} from 'actions/task-template-actions';
import * as ActionTypes from 'actions/action-types';
import SmartFlowIcon from 'img/template/smartflow.svg';
import {
  TaskTemplateContainer,
  TaskTemplateHeader,
  NameInput,
  ArrowButton,
  QuickAddInputWrapper,
  ArrowButtonContainer,
  SmartFlowIndicatorContainer,
  SmartFlowButton,
  SmartFlowIndicatorIcon,
  CheckboxPlaceholder,
  Spacer,
} from './styled';

const TaskTemplate = ({
  template,
  isFullView,
  children,
  highlighted = false,
  iconColorActive,
}) => {
  const {
    identifier,
    name,
    templateType,
    publicAccess = false,
    members,
  } = template;
  const smartFlowsAvailable = useSelector(userHasSmartFlowsSelector);
  const currentUser = useSelector(userProfileSelector);

  const [draggableId, setDraggableId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);
  const history = useHistory();

  const isCurrentUserEditor =
    members?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'EDITOR';

  const isAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  useEffect(() => {
    if (nameInputReference?.current && highlighted) {
      nameInputReference.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [highlighted, nameInputReference]);

  const dispatch = useDispatch();
  const { isOpen, isFetching, tasks } =
    useSelector(taskTemplateDetailsSelector(identifier)) || {};
  const folderIdentifier = useSelector(currentFolderIdentifierSelector);

  useEffect(() => {
    setNameInputValue(name);
    // eslint-disable-next-line no-unused-expressions
    nameInputReference.current?.blur();
  }, [name]);

  const handleShareWorkflow = () => {
    dispatch(
      ModalActions.openModal('ShareWorkflow', {
        workflowIdentifier: identifier,
      }),
    );
  };

  const menuOptions = useMemo(
    () => [
      isCurrentUserEditor &&
        (smartFlowsAvailable || templateType === 'SMARTFLOW_SAMPLE') && {
          name: 'Open in SmartFlow Builder',
          onClick: () => history.push(createWorkflowBuilderPath(identifier)),
        },
      isCurrentUserEditor &&
        (smartFlowsAvailable || templateType !== 'SMARTFLOW_SAMPLE') && {
          name: 'Edit Workflow Name',
          onClick: () => {
            setIsEditing(true);
            // eslint-disable-next-line no-unused-expressions
            nameInputReference.current?.focus();
          },
        },
      isCurrentUserEditor &&
        (smartFlowsAvailable || templateType !== 'SMARTFLOW_SAMPLE') && {
          name: 'Move to folder',
          onClick: () =>
            dispatch(
              ModalActions.openModal('SelectWorkflowDestination', {
                confirmText: 'Move',
                confirm: (parentTaskWorkflowIdentifier) => {
                  dispatch(
                    moveWorkflowToFolder(
                      identifier,
                      parentTaskWorkflowIdentifier,
                    ),
                  );
                },
                onAddFolderCallback: (createdFolder) => {
                  if (
                    folderIdentifier ===
                    createdFolder.parentTaskWorkflowIdentifier
                  ) {
                    dispatch({
                      type: ActionTypes.ADD_TASK_TEMPLATE_SUCCESS,
                      template: createdFolder,
                    });
                  }
                },
              }),
            ),
        },
      (smartFlowsAvailable || templateType !== 'SMARTFLOW_SAMPLE') && {
        name: 'Duplicate Workflow',
        onClick: () =>
          dispatch(
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () =>
                dispatch(WorkflowActions.duplicateWorkflow(identifier, true)),
              skip: () =>
                dispatch(WorkflowActions.duplicateWorkflow(identifier, false)),
            }),
          ),
      },
      isCurrentUserEditor && {
        name: publicAccess ? 'Make Private' : 'Make Public',
        onClick: () => {
          dispatch(switchTemplatePublic(identifier, !publicAccess));
        },
      },
      isAdmin && {
        name: 'Copy to another organization',
        onClick: () =>
          dispatch(
            ModalActions.openModal('SelectOrganization', {
              confirmText: 'Copy',
              confirm: (selectedItems) => {
                dispatch(
                  copyWorkflowToOrganization(
                    identifier,
                    selectedItems?.organizations,
                  ),
                );
              },
            }),
          ),
      },
      isCurrentUserEditor && {
        name: 'Share Workflow',
        color: palette.oPlusRed,
        onClick: handleShareWorkflow,
        // dispatch(
        //   ModalActions.openModal('ShareWorkflow', {
        //     // title: 'Delete workflow',
        //     // description:
        //     //   'Are you sure you want to delete this workflow? This action cannot be undone.',
        //     // confirm: () => {
        //     //   dispatch(WorkflowActions.deleteWorkflow(identifier));
        //     //   dispatch(ModalActions.closeModal());
        //     // },
        //   }),
        // ),
      },
      isCurrentUserEditor && {
        name: 'Delete Workflow',
        color: palette.oPlusRed,
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete workflow',
              description:
                'Are you sure you want to delete this workflow? This action cannot be undone.',
              confirm: () => {
                dispatch(WorkflowActions.deleteWorkflow(identifier));
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
      },
    ],
    [
      smartFlowsAvailable,
      templateType,
      history,
      identifier,
      dispatch,
      folderIdentifier,
      publicAccess,
      isCurrentUserEditor,
      isAdmin,
    ],
  );

  const handleNameInputKeyDown = useCallback(
    (event) => {
      const {
        key,
        target: { value },
      } = event;
      if (key === 'Enter') {
        if (value?.length > 1) {
          setNameInputError(false);
          dispatch(
            updatePartialWorkflow(identifier, {
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
    [dispatch, identifier],
  );

  const handleAddTaskToTemplate = useCallback(
    (task) => {
      dispatch(
        addTaskToTemplate({
          ...task,
          taskTemplateIdentifier: identifier,
        }),
      );
    },
    [dispatch, identifier],
  );

  const onBeforeCapture = useCallback(({ draggableId: id }) => {
    setDraggableId(id);
  }, []);

  const onDragEnd = useCallback(
    ({ destination, source }) => {
      setDraggableId(null);
      onTaskOrderChanged();

      dispatch(
        reorderTasksForTemplate({
          taskTemplateIdentifier: identifier,
          source,
          destination,
        }),
      );
    },
    [dispatch, identifier],
  );

  const containsMultipleAssignees = useMemo(
    () =>
      tasks?.some(
        // eslint-disable-next-line no-shadow
        ({ assignedToUsers, subtasks }) =>
          (assignedToUsers && assignedToUsers.length > 1) ||
          (subtasks &&
            subtasks.some(
              ({ assignedToUsers: subtaskAssignedToUsers }) =>
                subtaskAssignedToUsers && subtaskAssignedToUsers.length > 1,
            )),
      ),
    [tasks],
  );

  const taskIdentifiers = tasks?.map((task) => task.taskIdentifier);

  const isTemplateSelected = useSelector(
    isTaskItemsSelectedSelector(taskIdentifiers),
  );

  const handleTemplateSelect = useCallback(() => {
    dispatch(
      TaskActions.changeTasksSelectedState(
        !isTemplateSelected,
        taskIdentifiers,
      ),
    );
  }, [dispatch, isTemplateSelected, tasks]);

  const onArrowClick = () => {
    if (isOpen) {
      dispatch(TaskActions.unselectAllTasks());
    }
    dispatch(toggleTemplateOpen(identifier));
  };

  const onSmartFlowClick = () => {
    history.push(createWorkflowBuilderPath(identifier));
  };

  const onChangeName = (event) => {
    setNameInputValue(event.target?.value);
    setNameInputError(false);
  };

  const onBlurName = () => {
    setIsEditing(false);
    setNameInputValue(name);
  };

  const handleNameClick = () => {
    if (isEditing) return;

    dispatch(openDrawer(identifier, template));
  };

  return (
    <TaskTemplateContainer>
      <TaskTemplateHeader highlighted={highlighted}>
        {templateType === 'WORKFLOW' && (
          <Checkbox
            isDisabled={!isOpen}
            isChecked={isTemplateSelected}
            onClick={handleTemplateSelect}
          />
        )}
        {(templateType === 'SMARTFLOW' ||
          templateType === 'SMARTFLOW_SAMPLE') && <CheckboxPlaceholder />}
        {templateType === 'WORKFLOW' && (
          <ArrowButtonContainer>
            <ArrowButton onClick={onArrowClick}>
              <RotatableChevron rotated={isOpen} />
            </ArrowButton>
          </ArrowButtonContainer>
        )}
        {(templateType === 'SMARTFLOW' ||
          templateType === 'SMARTFLOW_SAMPLE') && (
          <Tooltip placement="top" title="A SmartFlow">
            <SmartFlowIndicatorContainer>
              <SmartFlowButton onClick={onSmartFlowClick}>
                <SmartFlowIndicatorIcon src={SmartFlowIcon} alt="SmartFlow" />
              </SmartFlowButton>
            </SmartFlowIndicatorContainer>
          </Tooltip>
        )}
        <OptionsMenu options={menuOptions}>
          <MoreVert color="primary" />
        </OptionsMenu>
        <NameInput
          ref={nameInputReference}
          readOnly={!isEditing}
          error={nameInputError}
          onChange={onChangeName}
          onBlur={onBlurName}
          onKeyDown={handleNameInputKeyDown}
          onClick={handleNameClick}
          value={nameInputValue}
        />
        {children}
        <Spacer />
      </TaskTemplateHeader>
      <Collapse in={isOpen}>
        <>
          {isFetching ? (
            <TasksSkeletonLoader rows={4} />
          ) : (
            <>
              <TasksHeader bulkEditEnabled={false} isGroupSelected={false} />
              <DragDropContext
                onBeforeCapture={onBeforeCapture}
                onDragEnd={onDragEnd}
              >
                <Droppable droppableId="droppable">
                  {(droppableProvided) => (
                    <div
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      {tasks?.map((taskOrIdentifier, index) => {
                        return (
                          <div style={{ marginBottom: '1px' }}>
                            <Draggable
                              key={
                                taskOrIdentifier?.taskIdentifier ||
                                taskOrIdentifier
                              }
                              draggableId={String(
                                taskOrIdentifier?.taskIdentifier ||
                                  taskOrIdentifier,
                              )}
                              index={index}
                            >
                              {(draggableProvided, draggableSnapshot) => (
                                <StandardTaskItemContainer
                                  isStartedDnD={
                                    draggableId ===
                                    (taskOrIdentifier?.taskIdentifier ||
                                      taskOrIdentifier)
                                  }
                                  isDragging={draggableSnapshot.isDragging}
                                  draggableProvided={draggableProvided}
                                  isDraggable
                                  taskIdentifier={
                                    taskOrIdentifier?.taskIdentifier ||
                                    taskOrIdentifier
                                  }
                                  isFullView={isFullView}
                                  multipleAssigneesContext={
                                    containsMultipleAssignees
                                  }
                                  noMargin
                                  iconColorActive={iconColorActive}
                                  origin={TaskOrigin.TEMPLATE}
                                />
                              )}
                            </Draggable>
                          </div>
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
                  iconColorActive={iconColorActive}
                />
              </QuickAddInputWrapper>
            </>
          )}
        </>
      </Collapse>
    </TaskTemplateContainer>
  );
};

export default TaskTemplate;
