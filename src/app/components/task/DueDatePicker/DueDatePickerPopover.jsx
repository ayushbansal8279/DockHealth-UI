import React, { useRef } from 'react';
import useBoolean from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { ClickAwayListener, Popper } from '@material-ui/core';
import DueDatePicker from './DueDatePicker';

const DueDatePickerPopover = ({
  taskIdentifier,
  selectedDate,
  onDateChange,
  children,
  minDate,
  maxDate,
  disabled,
  recurring,
  disableRecurring,
  placement = 'bottom-end',
}) => {
  const elementReference = useRef(null);
  const { 0: isPopoverOpen, 2: closePopover, 3: togglePopover } = useBoolean();

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={event => {
          event.stopPropagation();
          togglePopover();
        }}
        ref={elementReference}
      >
        {children}
      </button>
      {isPopoverOpen && (
        <ClickAwayListener onClickAway={closePopover}>
          <Popper
            style={{ zIndex: 2001 }}
            anchorEl={elementReference?.current}
            placement={placement}
            open={isPopoverOpen}
            onClose={closePopover}
          >
            <PopoverCard>
              <DueDatePicker
                taskIdentifier={taskIdentifier}
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                minDate={minDate}
                maxDate={maxDate}
                recurring={recurring}
                disableRecurring={disableRecurring}
                onCloseClick={closePopover}
              />
            </PopoverCard>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default DueDatePickerPopover;
