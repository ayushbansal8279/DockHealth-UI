import React from 'react';
import Spacing from 'components/common/Spacing';
import FilterDateInput from '../FilterDateInput/FilterDateInput';

import { Container, DateRangeInputsWrapper, OptionLabel } from './styled';

const DateRangeOptions = ({
  dateStart,
  dateEnd,
  onStartDateChange,
  onEndDateChange,
  setStartDate,
  startDate,
  setDueDate,
  dueDate,
}) => {
  return (
    <DateRangeInputsWrapper>
      <FilterDateInput
        start
        startDate={startDate}
        setStartDate={setStartDate}
        date={dateStart}
        maxDate={dueDate}
        // onDateChange={onStartDateChange}
      />
      <Spacing horizontal={3} />
      <FilterDateInput
        due
        dueDate={dueDate}
        setDueDate={setDueDate}
        date={dateEnd}
        minDate={startDate}
        // onDateChange={onEndDateChange}
      />
    </DateRangeInputsWrapper>
    // </Container>
  );
};

export default DateRangeOptions;
