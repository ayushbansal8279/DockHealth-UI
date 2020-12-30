/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, MenuContainer, MenuItemButtom } from './styled';

const TaskItemContextMenu = ({ position, isSubtask, onClose }) => {
  const menuReference = useRef(null);

  const handleKeyDown = useCallback(event => {
    function handleBackwardTab(elements) {
      if (document.activeElement === elements[0]) {
        event.preventDefault();
        elements[elements.length - 1].focus();
      }
    }

    function handleForwardTab(elements) {
      if (document.activeElement === elements[elements.length - 1]) {
        event.preventDefault();
        elements[0].focus();
      }
    }

    if (event.key === 'Tab') {
      const focusableElements = menuReference.current.querySelectorAll(
        'button:not([disabled])',
      );
      const anyElementFocused = [...focusableElements].some(
        element => element === document.activeElement,
      );

      if (!anyElementFocused) {
        event.preventDefault();
        if (event.shiftKey) {
          focusableElements[focusableElements.length - 1].focus();
        } else {
          focusableElements[0].focus();
        }
        return;
      }

      if (event.shiftKey) {
        handleBackwardTab(focusableElements);
      } else {
        handleForwardTab(focusableElements);
      }
    } else if (event.key === 'Esc') {
      event.preventDefault();
      onClose();
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
          <MenuItemButtom tabindex="0" type="button" onClick={() => {}}>
            Option 1
          </MenuItemButtom>
        </li>
        <li>
          <MenuItemButtom type="button" onClick={() => {}}>
            Option 2
          </MenuItemButtom>
        </li>
        {isSubtask && (
          <li>
            <MenuItemButtom type="button" onClick={() => {}}>
              Option 2
            </MenuItemButtom>
          </li>
        )}
      </MenuContainer>
    </Backdrop>
  );
};

TaskItemContextMenu.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  isSubtask: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

TaskItemContextMenu.defaultProps = {
  position: null,
  isSubtask: false,
};

export default TaskItemContextMenu;
