import { Popover } from '@material-ui/core';
import { bool, element, func, node, shape } from 'prop-types';
import React from 'react';
import { useCss } from 'react-use';

const InputPopover = ({
  anchorElement,
  isPopoverOpen,
  closePopover,
  children,
  popupStyle,
}) => {
  const widthValue =
    popupStyle?.width ||
    `${anchorElement.current?.getBoundingClientRect().width}px` ||
    {};

  const popoverClassName = useCss({
    '&&': {
      border: 0,
      marginTop: '0.5rem',
      width: widthValue,
    },
  });

  return (
    <Popover
      anchorEl={anchorElement.current}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      transformOrigin={{
        horizontal: 'left',
        vertical: 'top',
      }}
      open={isPopoverOpen}
      onClose={closePopover}
      transitionDuration={0}
      PaperProps={{
        className: popoverClassName,
        elevation: 1,
      }}
      style={popupStyle}
    >
      {children}
    </Popover>
  );
};

InputPopover.propTypes = {
  anchorElement: shape({
    current: element,
  }).isRequired,
  isPopoverOpen: bool.isRequired,
  closePopover: func.isRequired,
  children: node,
};

InputPopover.defaultProps = {
  children: null,
};

export default InputPopover;
