import React from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import {
  DueDateRangePickerRowContainer,
  DueDateInput,
  DueDateRangePickerInputsWrapper,
  OptionLabel,
} from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const DATE_US_FORMAT = 'MM/DD/YY';

const DueDateRangePicker = ({ label }) => {
  const selectedStartDate = '2020-02-02';
  const selectedEndDate = '2020-06-02';

  const inputStartDate = moment(selectedStartDate, DATE_ISO_FORMAT).format(
    DATE_US_FORMAT,
  );
  const inputEndDate = moment(selectedEndDate, DATE_ISO_FORMAT).format(
    DATE_US_FORMAT,
  );

  console.log('inp', inputStartDate);

  return (
    <DueDateRangePickerRowContainer>
      <OptionLabel>{label}</OptionLabel>
      <DueDateRangePickerInputsWrapper>
        <PopoverDatepicker
          selectedDate={selectedStartDate}
          onDateChange={date => {
            console.log('start date', date);
          }}
        >
          {({ elementReference, setIsPopoverOpen }) => (
            <DueDateInput
              ref={elementReference}
              onFocus={() => setIsPopoverOpen(true)}
              onBlur={() => console.log('blur')}
              value={inputStartDate}
            />
          )}
        </PopoverDatepicker>
        <Spacing horizontal={3} />

        <PopoverDatepicker
          selectedDate={selectedEndDate}
          onDateChange={date => {
            console.log('end date', date);
          }}
        >
          {({ elementReference, setIsPopoverOpen }) => (
            <DueDateInput
              ref={elementReference}
              onFocus={() => setIsPopoverOpen(true)}
              onBlur={() => console.log('blur')}
              value={inputEndDate}
            />
          )}
        </PopoverDatepicker>
      </DueDateRangePickerInputsWrapper>
    </DueDateRangePickerRowContainer>
  );
};

export default DueDateRangePicker;
