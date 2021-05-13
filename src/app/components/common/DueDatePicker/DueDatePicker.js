import React, { useRef } from 'react';
import moment from 'moment';
import useBoolean from 'hooks/useBoolean';
import { ClickAwayListener, Popper } from '@material-ui/core';

import Datepicker from 'components/common/Datepicker/Datepicker';
import TimeDropdownInput from 'components/task-drawer/TimeDropdownInput/TimeDropdownInput';
import TimeIcon from 'img/time';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import {
  ContentWrapper,
  Divider,
  QuickAddSectionWrapper,
  QuickSelectButton,
} from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';

const DueDatePicker = ({
  selectedDate,
  onDateChange,
  children,
  minDate,
  maxDate,
  disabled,
}) => {
  const elementReference = useRef(null);
  const { 0: isPopoverOpen, 2: closePopover, 3: togglePopover } = useBoolean();

  const momentSelectedDate = selectedDate ? moment(selectedDate) : null;
  const selectedTime = momentSelectedDate?.format(TIME_12H_FORMAT) || null;

  const handleDatePick = pickedDate => {
    onDateChange(
      moment(
        `${pickedDate} ${selectedTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ),
    );
  };

  const handleTimePick = pickedTime => {
    onDateChange(
      moment(
        `${moment(selectedDate).format(DATE_ISO_FORMAT)} ${pickedTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ),
    );
  };

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
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isPopoverOpen}
            onClose={closePopover}
          >
            <ContentWrapper>
              <QuickAddSectionWrapper>
                <QuickSelectButton
                  type="button"
                  isSelected={momentSelectedDate?.isSame(moment(), 'd')}
                  onClick={() =>
                    handleDatePick(moment().format(DATE_ISO_FORMAT))
                  }
                >
                  Today
                </QuickSelectButton>
                <QuickSelectButton
                  type="button"
                  isSelected={momentSelectedDate?.isSame(
                    moment().add(1, 'days'),
                    'd',
                  )}
                  onClick={() =>
                    handleDatePick(
                      moment()
                        .add(1, 'days')
                        .format(DATE_ISO_FORMAT),
                    )
                  }
                >
                  Tomorrow
                </QuickSelectButton>
                <TimeDropdownInput
                  type="secondary"
                  savedValue={selectedTime}
                  onSave={handleTimePick}
                  disabled={false}
                  endAdornment={<img src={TimeIcon} alt="Arrow" />}
                  hideError
                />
              </QuickAddSectionWrapper>
              <Divider />
              <Datepicker
                selectedDate={selectedDate}
                onDateChange={handleDatePick}
                minDate={minDate}
                maxDate={maxDate}
              />
            </ContentWrapper>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default DueDatePicker;
