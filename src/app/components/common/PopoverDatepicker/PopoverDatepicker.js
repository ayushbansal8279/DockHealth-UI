import React, { useState, useRef, useEffect } from 'react';
import { Divider } from '@material-ui/core';

import Datepicker from 'components/common/Datepicker/Datepicker';
import { RobotoTypography } from 'styles/theme';
import { StyledPopover, DatepickerOptionLabelContainer } from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';

const PopoverDatepicker = ({
  selectedDate,
  onDateChange,
  children,
  quickSelectOptions,
}) => {
  const buttonReference = useRef(null);
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
          isSelected={selectedDate && date.isSame(selectedDate, 'day')}
          disabled={selectedDate && date.isSame(selectedDate, 'day')}
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
      <button
        type="button"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        ref={buttonReference}
      >
        {children}
      </button>
      <StyledPopover
        anchorEl={buttonReference?.current}
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
          />
        )}
      </StyledPopover>
    </>
  );
};

export default PopoverDatepicker;
