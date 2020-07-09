import React, { useRef } from 'react';
import { Popper } from '@material-ui/core';
import { PopperTopArrow, PopperBottomArrow, PopperWrapper } from './styled';

const TaskDrawerTourPopover = ({ children, anchorEl, position, open }) => {
  const arrowReference = useRef(null);

  const isArrowTop = position.includes('bottom');
  const isArrowBottom = position.includes('top');
  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
      placement={position}
      disablePortal={false}
      style={{ zIndex: 10000 }}
      modifiers={{
        flip: {
          enabled: false,
        },
        preventOverflow: {
          enabled: false,
          boundariesElement: 'scrollParent',
        },
        arrow: {
          enabled: true,
          element: arrowReference?.current,
        },
      }}
    >
      <PopperWrapper>{children}</PopperWrapper>
      {isArrowTop && <PopperTopArrow ref={arrowReference} />}
      {isArrowBottom && <PopperBottomArrow ref={arrowReference} />}
    </Popper>
  );
};

export default TaskDrawerTourPopover;
