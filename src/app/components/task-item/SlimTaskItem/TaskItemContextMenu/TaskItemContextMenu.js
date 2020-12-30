/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import palette from 'styles/palette';
import { deleteTask, duplicateTask } from 'actions/task-actions';
import { openModal } from 'modal/actions';
import { Backdrop, MenuContainer, MenuItemButtom, Divider } from './styled';

const TaskItemContextMenu = ({ position, task, onClose }) => {
  const menuReference = useRef(null);
  const dispatch = useDispatch();

  const isSubtask = !!task.parentTaskIdentifier;

  const handleKeyDown = useCallback(event => {
    function handleBackward() {
      event.preventDefault();
      let elements = menuReference.current.querySelectorAll(
        'button:not([disabled])',
      );
      elements = [...elements];
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

    function handleForward() {
      event.preventDefault();
      let elements = menuReference.current.querySelectorAll(
        'button:not([disabled])',
      );
      elements = [...elements];

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

  const handleDuplicateTask = () => {
    if (task.attachments?.length > 0) {
      const modalProps = {
        confirm: () => dispatch(duplicateTask(task, true)),
        skip: () => dispatch(duplicateTask(task)),
      };
      dispatch(openModal('DuplicateTask', modalProps));
    } else {
      dispatch(duplicateTask(task));
    }
  };

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
        {!isSubtask && (
          <li>
            <MenuItemButtom tabindex="0" type="button" onClick={() => {}}>
              Move to list
            </MenuItemButtom>
          </li>
        )}
        <li>
          <MenuItemButtom type="button" onClick={handleDuplicateTask}>
            Duplicate {isSubtask ? 'Subtask' : 'Task'}
          </MenuItemButtom>
        </li>
        {!isSubtask && (
          <li>
            <MenuItemButtom type="button" onClick={() => {}}>
              Create Subtask
            </MenuItemButtom>
          </li>
        )}
        <Divider />
        <li>
          <MenuItemButtom
            type="button"
            color={palette.oPlusRed}
            onClick={() => dispatch(deleteTask(task))}
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
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  task: PropTypes.shape({
    parentTaskIdentifier: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

TaskItemContextMenu.defaultProps = {
  position: null,
};

export default TaskItemContextMenu;
