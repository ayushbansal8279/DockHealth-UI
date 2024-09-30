/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/palette';
import * as TaskApi from 'api/task-api';
import { onRightClickAction } from 'helpers/ga-event-helper';
import { checkIfTemplateTask, checkIfBundleTask } from 'helpers/task-helpers';
import * as ActionTypes from 'actions/action-types';
import {
  deleteTask,
  duplicateTask,
  openQuickAddSubtask,
  moveTask,
  markTaskAsRead,
  markTaskAsUnRead,
} from 'actions/task-actions';
import { openModal, closeModal } from 'modal/actions';
import { getTasksGroupsList } from 'actions/list-details-actions';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import { userHasShareTaskFeatureSelector } from 'selectors/user-selectors';
import { Backdrop, MenuContainer, MenuItemButton, Divider } from './styled';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TaskItemContextMenu = ({
  position,
  task,
  onClose,
  subtasksDisabled,
  isDashboardTask,
  currentList,
  restrictions,
}) => {
  const menuReference = useRef(null);
  const dispatch = useDispatch();

  const isSubtask = !!task.parentTaskIdentifier;
  const isTemplateTask = checkIfTemplateTask(task);
  const isBundleTask = checkIfBundleTask(task);

  const shareTaskAvailable = useSelector(userHasShareTaskFeatureSelector);

  const handleKeyDown = useCallback((event) => {
    function handleBackward() {
      event.preventDefault();
      let elements = menuReference.current.querySelectorAll(
        'button:not([disabled])',
      );
      // converting `NodeList` to an array
      elements = [...elements];

      if (elements?.length > 1) {
        const activeIndex = elements.indexOf(document.activeElement);
        if (activeIndex === 0) {
          event.preventDefault();
          elements[elements.length - 1].focus();
        } else if (activeIndex === -1) {
          elements[0].focus();
        } else {
          elements[activeIndex - 1].focus();
        }
      }
    }

    function handleForward() {
      event.preventDefault();
      let elements = menuReference.current.querySelectorAll(
        'button:not([disabled])',
      );
      // converting `NodeList` to an array
      elements = [...elements];

      if (elements?.length > 1) {
        const activeIndex = elements.indexOf(document.activeElement);
        if (activeIndex === elements.length - 1) {
          event.preventDefault();
          elements[0].focus();
        } else if (activeIndex === -1) {
          elements[0].focus();
        } else {
          elements[activeIndex + 1].focus();
        }
      }
    }

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        handleBackward();
      } else {
        handleForward();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      handleForward();
    } else if (event.key === 'ArrowUp') {
      handleBackward();
    }
  }, []);

  const checkMenuPosition = useCallback(() => {
    const menuElement = menuReference.current;
    const { offsetHeight: menuHeight, offsetWidth: menuWidth } = menuElement;
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

    const outsideXAxis = position.x + menuWidth >= windowWidth;
    const outsideYAxis = position.y + menuHeight >= windowHeight;

    if (outsideXAxis && outsideYAxis) {
      menuElement.style.transform = 'translate(-100%, -100%)';
    }

    if (outsideXAxis) {
      menuElement.style.transform = 'translateX(-100%)';
    }

    if (outsideYAxis) {
      menuElement.style.transform = 'translateY(-100%)';
    }
  }, []);

  const handleDuplicateTask = useCallback(async () => {
    let taskToDuplicate = { ...task };
    let subtaskHasAttachment = false;
    const EVENT_NAME = 'Duplicate task';

    if (task.subTasksCount > task.subtasks?.length) {
      try {
        taskToDuplicate = await TaskApi.getTaskDetails(task?.taskIdentifier);
        taskToDuplicate.updated = true;
        dispatch({
          type: ActionTypes.LOAD_SUBTASKS_SUCCESS,
          task: taskToDuplicate,
        });
      } catch (error) {
        subtaskHasAttachment = true;
      }
    }

    if (taskToDuplicate.subtasks?.length > 0) {
      subtaskHasAttachment =
        taskToDuplicate.subtasks?.some(
          ({ attachments }) => attachments?.length > 0,
        ) || false;
    }

    if (taskToDuplicate.attachments?.length > 0 || subtaskHasAttachment) {
      const modalProps = {
        confirm: () => {
          dispatch(duplicateTask(task, true, isDashboardTask));
          onRightClickAction(EVENT_NAME);
        },
        skip: () => {
          dispatch(duplicateTask(task, false, isDashboardTask));
          onRightClickAction(EVENT_NAME);
        },
      };
      dispatch(openModal('AttachmentsDuplicate', modalProps));
    } else {
      dispatch(duplicateTask(task, false, isDashboardTask));
      onRightClickAction(EVENT_NAME);
    }
  }, []);

  const handleDeleteTask = useCallback(() => {
    const modalProps = {
      isSubtask: !!task.parentTaskIdentifier,
      confirm: async () => {
        await dispatch(deleteTask(task));
        dispatch(closeModal());
        onRightClickAction('Delete task');
      },
    };

    dispatch(openModal('DeleteTaskConfirmation', modalProps));
  }, []);

  const handleMarkAsRead = useCallback(() => {
    dispatch(markTaskAsRead(task.taskIdentifier));
  }, []);

  const handleMarkAsUnRead = useCallback(() => {
    dispatch(markTaskAsUnRead(task.taskIdentifier));
  }, []);

  const handleMoveTask = useCallback(() => {
    const hasSubtasks = task.subTasksCount !== 0;

    const confirmAction = ({
      taskListIdentifier,
      taskGroupIdentifier,
      parentTaskIdentifier,
    }) => {
      dispatch(
        moveTask(
          task,
          { taskListIdentifier },
          taskGroupIdentifier || null,
          parentTaskIdentifier || null,
          isDashboardTask,
        ),
      );
      onRightClickAction('Move task');
    };

    const openMoveTasksWithSubtasksModal = ({
      taskListIdentifier,
      taskGroupIdentifier,
      parentTaskIdentifier,
    }) =>
      dispatch(
        openModal('MoveTasksWithSubtasks', {
          confirm: () =>
            confirmAction({
              taskListIdentifier,
              taskGroupIdentifier,
              parentTaskIdentifier,
            }),
        }),
      );

    dispatch(
      openModal('SelectTaskDestination', {
        tasksToMove: [task],
        confirmText: 'Move',
        confirm: hasSubtasks ? openMoveTasksWithSubtasksModal : confirmAction,
        preventClosingModal: hasSubtasks,
        modalLabel: 'Move to List'
      }),
    );
  }, [task]);

  const handleMoveGroupTask = useCallback(() => {
    const handleAddGroupTask = () => {
      dispatch(getTasksGroupsList());
    };

    dispatch(
      openModal('SelectDestinationGroup', {
        confirm: (group) => {
          dispatch(
            moveTask(
              task,
              { taskListIdentifier: currentList.identifier },
              group.taskGroupIdentifier || null,
              null,
              isDashboardTask,
            ),
          );
          onRightClickAction('Move task');
        },
        selectedList: currentList,
        onCreateGroup: handleAddGroupTask,
      }),
    );
  }, []);

  useEffect(() => {
    checkMenuPosition();
    const focusedElementBeforeOpen = document.activeElement;
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      focusedElementBeforeOpen.focus();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleShareTask = () => {
    dispatch(openModal('ShareTask', { taskIdentifier: task.identifier }));
  };

  if (!position || !position.x || !position.y) return null;

  return (
    <Backdrop
      open
      onClick={onClose}
      onContextMenu={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <MenuContainer
        ref={menuReference}
        positionTop={position.y}
        positionLeft={position.x}
      >
        {restrictions?.move !== DISABLED &&
          !isTemplateTask &&
          !isBundleTask && (
            <div>
              <MenuItemButton
                tabIndex="0"
                type="button"
                onClick={handleMoveTask}
              >
                Move to list
              </MenuItemButton>
            </div>
          )}
        {restrictions?.move !== DISABLED &&
          !isTemplateTask &&
          !isBundleTask && (
            <div>
              <MenuItemButton type="button" onClick={handleMoveGroupTask}>
                Move to group
              </MenuItemButton>
            </div>
          )}
        {!task.read && !isTemplateTask && (
          <div>
            <MenuItemButton
              tabIndex="0"
              type="button"
              onClick={handleMarkAsRead}
            >
              Mark as read
            </MenuItemButton>
          </div>
        )}
        {task.read && !isTemplateTask && (
          <div>
            <MenuItemButton
              tabIndex="0"
              type="button"
              onClick={handleMarkAsUnRead}
            >
              Mark as unread
            </MenuItemButton>
          </div>
        )}
        {restrictions?.duplicate !== DISABLED && (
          <div>
            <MenuItemButton type="button" onClick={handleDuplicateTask}>
              Duplicate {isSubtask ? 'subtask' : 'task'}
            </MenuItemButton>
          </div>
        )}
        {restrictions?.subtasks !== READ_ONLY &&
          !isSubtask &&
          !subtasksDisabled && (
            <div>
              <MenuItemButton
                type="button"
                onClick={() => {
                  dispatch(openQuickAddSubtask(task.taskIdentifier));
                  onRightClickAction('Create subtask');
                }}
              >
                Create subtask
              </MenuItemButton>
            </div>
          )}
        {shareTaskAvailable && !isTemplateTask && (
          <div>
            <MenuItemButton type="button" onClick={handleShareTask}>
              Share task
            </MenuItemButton>
          </div>
        )}
        {restrictions?.delete !== DISABLED && (
          <>
            <Divider />
            <div>
              <MenuItemButton
                type="button"
                color={palette.oPlusRed}
                onClick={handleDeleteTask}
              >
                Delete {isSubtask ? 'subtask' : 'task'}
              </MenuItemButton>
            </div>
          </>
        )}
      </MenuContainer>
    </Backdrop>
  );
};

TaskItemContextMenu.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  task: PropTypes.shape({
    taskIdentifier: PropTypes.string.isRequired,
    parentTaskIdentifier: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TaskItemContextMenu;
