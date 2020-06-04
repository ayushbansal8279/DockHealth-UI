import React from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import {
  DueDateRangePickerRowContainer,
  DueDateInput,
  DueDateRangePickerInputsWrapper,
  OptionLabel,
  DueDateInputWrapper,
} from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const DATE_US_FORMAT = 'MM/DD/YYYY';

const DueDateRangePicker = ({
  label,
  dueDateChange,
  customDueDateEnd,
  customDueDateStart,
}) => {
  const formatedDateStart = customDueDateStart
    ? moment(customDueDateStart, DATE_ISO_FORMAT).format(DATE_US_FORMAT)
    : null;
  const formatedDateEnd = customDueDateEnd
    ? moment(customDueDateEnd, DATE_ISO_FORMAT).format(DATE_US_FORMAT)
    : null;

  // const [inputDueDateStart, setInputDueDateStart] = useState(formatedDateStart);
  // const [inputDueDateEnd, setInputDueDateEnd] = useState(formatedDateEnd);

  // const validateDueDateStart = () => {};

  // const validateDueDateEnd = () => {};

  return (
    <DueDateRangePickerRowContainer>
      <OptionLabel>{label}</OptionLabel>
      <DueDateRangePickerInputsWrapper>
        <PopoverDatepicker
          selectedDate={customDueDateStart}
          onDateChange={date => dueDateChange(date, customDueDateEnd)}
          maxDate={customDueDateEnd}
        >
          {({ elementReference, setIsPopoverOpen }) => (
            <DueDateInputWrapper ref={elementReference}>
              <DueDateInput
                onFocus={() => setIsPopoverOpen(true)}
                // onChange={event => setInputDueDateStart(event.target.value)}
                // onBlur={validateDueDateStart}
                value={formatedDateStart}
                placeholder="00/00/0000"
              />
            </DueDateInputWrapper>
          )}
        </PopoverDatepicker>
        <Spacing horizontal={3} />

        <PopoverDatepicker
          selectedDate={customDueDateEnd}
          onDateChange={date => dueDateChange(customDueDateStart, date)}
          minDate={customDueDateStart}
        >
          {({ elementReference, setIsPopoverOpen }) => (
            <DueDateInputWrapper ref={elementReference}>
              <DueDateInput
                onFocus={() => setIsPopoverOpen(true)}
                // onChange={event => setInputDueDateEnd(event.target.value)}
                // onBlur={validateDueDateEnd}
                value={formatedDateEnd}
                placeholder="00/00/0000"
              />
            </DueDateInputWrapper>
          )}
        </PopoverDatepicker>
      </DueDateRangePickerInputsWrapper>
    </DueDateRangePickerRowContainer>
  );
};

export default DueDateRangePicker;
