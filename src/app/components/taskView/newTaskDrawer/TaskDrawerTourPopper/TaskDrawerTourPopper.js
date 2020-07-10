import React, { useState } from 'react';
import { Popper } from '@material-ui/core';
import { PopperTopArrow, PopperBottomArrow, PopperWrapper } from './styled';

const TaskDrawerTourPopover = ({ children, anchorEl, position, open }) => {
  const [arrowReference, setArrowReference] = useState(null);

  const isArrowTop = position.includes('bottom');
  const isArrowBottom = position.includes('top');

  const setReference = element => {
    if (element !== null && arrowReference === null) {
      setArrowReference(element);
    }
  };

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
          element: arrowReference,
        },
      }}
    >
      {isArrowTop && <PopperTopArrow ref={setReference} />}
      <PopperWrapper>{children}</PopperWrapper>
      {isArrowBottom && <PopperBottomArrow ref={setReference} />}
    </Popper>
  );
};

export default TaskDrawerTourPopover;
