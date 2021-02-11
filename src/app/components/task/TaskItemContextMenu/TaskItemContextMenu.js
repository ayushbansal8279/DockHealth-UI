/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import palette from 'styles/palette';
import * as TaskApi from 'api/task-api';
import * as ActionTypes from 'actions/action-types';
import {
  deleteTask,
  duplicateTask,
  openQuickAddSubtask,
  moveTask,
} from 'actions/task-actions';
import { openModal, closeModal } from 'modal/actions';
import { Backdrop, MenuContainer, MenuItemButtom, Divider } from './styled';

const TaskItemContextMenu = ({ position, task, onClose, subtasksDisabled }) => {
  const menuReference = useRef(null);
  const dispatch = useDispatch();

  const isSubtask = !!task.parentTaskIdentifier;

  const handleKeyDown = useCallback(event => {
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
        confirm: () => dispatch(duplicateTask(task, true)),
        skip: () => dispatch(duplicateTask(task)),
      };
      dispatch(openModal('DuplicateTask', modalProps));
    } else {
      dispatch(duplicateTask(task));
    }
  }, []);

  const handleDeleteTask = useCallback(() => {
    const modalProps = {
      confirm: async () => {
        await dispatch(deleteTask(task));
        dispatch(closeModal());
      },
    };
    const modalName =
      task.parentTaskIdentifier !== null ? 'DeleteSubtask' : 'DeleteTask';
    dispatch(openModal(modalName, modalProps));
  }, []);

  const handleMoveTask = useCallback(() => {
    dispatch(
      openModal('SelectTaskDestination', {
        tasksToMove: [task],
        confirmText: 'Move',
        confirm: ({
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
            ),
          );
        },
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

  if (!position || !position.x || !position.y) return null;

  return (
    <Backdrop
      open
      onClick={onClose}
      onContextMenu={event => {
        event.preventDefault();
        onClose();
      }}
    >
      <MenuContainer
        ref={menuReference}
        positionTop={position.y}
        positionLeft={position.x}
      >
        <li>
          <MenuItemButtom tabindex="0" type="button" onClick={handleMoveTask}>
            Move to list
          </MenuItemButtom>
        </li>
        <li>
          <MenuItemButtom type="button" onClick={handleDuplicateTask}>
            Duplicate {isSubtask ? 'Subtask' : 'Task'}
          </MenuItemButtom>
        </li>
        {!isSubtask && !subtasksDisabled && (
          <li>
            <MenuItemButtom
              type="button"
              onClick={() => dispatch(openQuickAddSubtask(task.taskIdentifier))}
            >
              Create Subtask
            </MenuItemButtom>
          </li>
        )}
        <Divider />
        <li>
          <MenuItemButtom
            type="button"
            color={palette.oPlusRed}
            onClick={handleDeleteTask}
          >
            Delete {isSubtask ? 'Subtask' : 'Task'}
          </MenuItemButtom>
        </li>
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
