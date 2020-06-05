import React, { useState, useRef, useEffect } from 'react';
import { Divider, Popper } from '@material-ui/core';

import Datepicker from 'components/common/Datepicker/Datepicker';
import { RobotoTypography } from 'styles/theme';
import {
  StyledPopover,
  DatepickerOptionLabelContainer,
  Backdrop,
} from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';

const PopoverDatepicker = ({
  selectedDate,
  onDateChange,
  onBackdrop,
  children,
  quickSelectOptions,
  minDate,
  maxDate,
}) => {
  const elementReference = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (!quickSelectOptions || quickSelectOptions.length === 0)
      setIsCalendarOpen(true);
  }, [quickSelectOptions]);

  const handleDatePick = pickedDate => {
    if (isCalendarOpen && quickSelectOptions?.length > 0)
      setIsCalendarOpen(false);

    setIsPopoverOpen(false);
    onDateChange(pickedDate);
  };

  const renderQuickOptions = () => (
    <>
      {quickSelectOptions.map(({ label, date }) => (
        <DatepickerOptionLabelContainer
          key={date}
          onClick={() => handleDatePick(date.format(DATE_ISO_FORMAT))}
        >
          <RobotoTypography condensed variant="h4">
            {label}
          </RobotoTypography>
        </DatepickerOptionLabelContainer>
      ))}
    </>
  );

  return (
    <>
      {isPopoverOpen && (
        <Backdrop
          type="button"
          onClick={() => {
            if (onBackdrop) onBackdrop();
            setIsPopoverOpen(false);
          }}
        />
      )}
      {children({ setIsPopoverOpen, isPopoverOpen, elementReference })}
      <Popper
        style={{ zIndex: 2001 }}
        anchorEl={elementReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
      >
        <StyledPopover>
          {quickSelectOptions?.length > 0 && (
            <>
              {renderQuickOptions()}
              <DatepickerOptionLabelContainer
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                isSelected={isCalendarOpen}
              >
                <RobotoTypography condensed variant="h4">
                  Select date
                </RobotoTypography>
              </DatepickerOptionLabelContainer>
              <Divider />
            </>
          )}
          {isCalendarOpen && (
            <Datepicker
              selectedDate={selectedDate}
              onDateChange={handleDatePick}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        </StyledPopover>
      </Popper>
    </>
  );
};

export default PopoverDatepicker;
