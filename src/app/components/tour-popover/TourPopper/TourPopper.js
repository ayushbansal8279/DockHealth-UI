import React, { useState, useEffect } from 'react';
import { Popper } from '@material-ui/core';
import {
  PopperTopArrow,
  PopperBottomArrow,
  PopperLeftArrow,
  PopperWrapper,
} from './styled';

const TourPopper = ({ children, anchorEl, position, open }) => {
  const [arrowReference, setArrowReference] = useState(null);

  const isTopArrow = position.includes('bottom');
  const isBottomArrow = position.includes('top');
  const isLeftArrow = position.includes('right');

  const setReference = element => {
    if (element !== null && arrowReference === null) {
      setArrowReference(element);
    }
  };

  useEffect(() => {
    if (!open) {
      setArrowReference(null);
    }
  }, [open]);

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
      {isTopArrow && <PopperTopArrow ref={setReference} />}
      {isLeftArrow && <PopperLeftArrow ref={setReference} />}
      <PopperWrapper>{children}</PopperWrapper>
      {isBottomArrow && <PopperBottomArrow ref={setReference} />}
    </Popper>
  );
};

export default TourPopper;
