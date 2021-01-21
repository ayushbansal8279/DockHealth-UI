import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  openCalendarWithOptions = false,
  usePortal,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const elementReference = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(openCalendarWithOptions);

  useEffect(() => {
    if (!quickSelectOptions || quickSelectOptions.length === 0) {
      setIsCalendarOpen(true);
    }
  }, [quickSelectOptions, openCalendarWithOptions]);

  // useEffect(() => {
  //   if (openCalendarWithOptions && isPopoverOpen) {
  //     setIsCalendarOpen(true);
  //   }
  // }, [openCalendarWithOptions, isPopoverOpen]);

  const handleDatePick = pickedDate => {
    if (
      (isCalendarOpen && quickSelectOptions?.length > 0) ||
      openCalendarWithOptions
    ) {
      setIsCalendarOpen(false);
    }

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
    <div
      onClick={event => {
        event.stopPropagation();
      }}
    >
      {isPopoverOpen &&
        (usePortal ? (
          ReactDOM.createPortal(
            <Backdrop
              type="button"
              onClick={event => {
                event.stopPropagation();
                if (onBackdrop) onBackdrop();
                setIsPopoverOpen(false);
              }}
            />,
            document.querySelector('#portal'),
          )
        ) : (
          <Backdrop
            type="button"
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={event => {
              event.stopPropagation();
              if (onBackdrop) onBackdrop();
              setIsPopoverOpen(false);
            }}
          />
        ))}
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
    </div>
  );
};

export default PopoverDatepicker;
