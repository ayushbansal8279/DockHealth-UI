import { ClickAwayListener, Popper } from '@material-ui/core';
import { useBoolean } from 'hooks/useBoolean';
import moment from 'moment';
import React, { useCallback, useRef } from 'react';
import Datepicker from 'components/common/Datepicker/Datepicker';
import { DATE_ISO_FORMAT } from 'components/common/Datepicker/helpers';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { DateInputMask } from './styled';

const INPUT_DATE_FORMAT = 'MM/DD/YYYY';

const SecondaryDateInput = ({
  value,
  disabled,
  onChange,
  onBlur,
  error,
  popoverDisabled = false,
  onEnter,
  disablePast,
}) => {
  const inputReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean();

  const isoDate =
    value && !value.includes('_')
      ? moment(value, INPUT_DATE_FORMAT).toISOString()
      : null;

  const handleDatepickerDateSelection = useCallback(
    newDate => {
      const inputFormatNewDate = moment(newDate, DATE_ISO_FORMAT).format(
        INPUT_DATE_FORMAT,
      );
      onChange(inputFormatNewDate);
      closePopover();
    },
    [closePopover, onChange],
  );

  const handleInputKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onEnter === 'function') onEnter();
      }
    },
    [onEnter],
  );

  return (
    <>
      <div ref={inputReference}>
        <DateInputMask
          ref={inputReference}
          type="text"
          mask="19/29/8999"
          maskChar="_"
          placeholder="mm/dd/yyyy"
          formatChars={{
            '1': '[0-1]',
            '2': '[0-3]',
            '8': '[1-9]',
            '9': '[0-9]',
          }}
          value={value}
          onBlur={typeof onBlur === 'function' && onBlur}
          onClick={!disabled && openPopover}
          onChange={event => onChange(event.target?.value)}
          error={error}
          autoComplete="off"
          disabled={disabled}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      {isPopoverOpen && !popoverDisabled && (
        <ClickAwayListener onClickAway={closePopover}>
          <Popper
            anchorEl={inputReference?.current}
            style={{ zIndex: 3001 }}
            placement="bottom"
            open={isPopoverOpen}
            disablePortal
          >
            <PopoverCard>
              <Datepicker
                selectedDate={isoDate}
                onDateChange={handleDatepickerDateSelection}
                disablePast={disablePast}
              />
            </PopoverCard>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default SecondaryDateInput;
