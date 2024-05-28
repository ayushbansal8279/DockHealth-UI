/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import palette from 'styles/palette';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import { TaskStatus } from 'helpers/task-helpers';
import {
  isShowCompletedTasks,
  isShowIncompleteTasks,
} from 'selectors/task-items-selectors';
import { Backdrop, MenuContainer, MenuItemButton, Divider } from './styled';

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TaskTemplateContextMenu = ({
  identifier,
  restrictions,
  position,
  onClose,
  handleAddTask,
  // handleEditName,
  handleMoveToList,
  handleMoveGroupTask,
  handleDuplicate,
  handleDelete,
  showCompletedTasks,
  showIncompleteTasks,
  tasksStatus,
  toggleCompletedTasksVisibility,
  toggleIncompleteTasksVisibility,
}) => {
  const menuReference = useRef(null);

  const isShowCompletedTasksFlag = useSelector(
    isShowCompletedTasks(identifier),
  );
  const isShowIncompleteTasksFlag = useSelector(
    isShowIncompleteTasks(identifier),
  );
  const showCompletedTasksResolved =
    showCompletedTasks || isShowCompletedTasksFlag;
  const showIncompleteTasksResolved =
    showIncompleteTasks || isShowIncompleteTasksFlag;

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
        {restrictions?.workflowAddTask !== DISABLED && (
          <div>
            <MenuItemButton tabIndex="0" type="button" onClick={handleAddTask}>
              Add Task
            </MenuItemButton>
          </div>
        )}
        {restrictions?.move !== DISABLED && (
          <div>
            <MenuItemButton
              tabIndex="0"
              type="button"
              onClick={handleMoveToList}
            >
              Move to List
            </MenuItemButton>
          </div>
        )}
        <div>
          <MenuItemButton
            tabIndex="0"
            type="button"
            onClick={handleMoveGroupTask}
          >
            Move To Group
          </MenuItemButton>
        </div>
        {restrictions?.duplicate !== DISABLED && (
          <div>
            <MenuItemButton type="button" onClick={handleDuplicate}>
              Duplicate
            </MenuItemButton>
          </div>
        )}
        {tasksStatus === TaskStatus.INCOMPLETE && (
          <div>
            <MenuItemButton
              type="button"
              onClick={toggleCompletedTasksVisibility}
            >
              {showCompletedTasksResolved
                ? 'Hide completed tasks'
                : 'Show completed tasks'}
            </MenuItemButton>
          </div>
        )}
        {tasksStatus === TaskStatus.COMPLETE && (
          <div>
            <MenuItemButton
              type="button"
              onClick={toggleIncompleteTasksVisibility}
            >
              {showIncompleteTasksResolved
                ? 'Hide incomplete tasks'
                : 'Show incomplete tasks'}
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
                onClick={handleDelete}
              >
                Delete
              </MenuItemButton>
            </div>
          </>
        )}
      </MenuContainer>
    </Backdrop>
  );
};

TaskTemplateContextMenu.propTypes = {
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

export default TaskTemplateContextMenu;
