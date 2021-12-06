import React from 'react';
import Spacing from 'components/common/Spacing';
import FilterDateInput from '../FilterDateInput/FilterDateInput';

import { Container, DateRangeInputsWrapper, OptionLabel } from './styled';

const DateRangeOptions = ({
  dateStart,
  dateEnd,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <Container>
      <OptionLabel>Range</OptionLabel>
      <DateRangeInputsWrapper>
        <FilterDateInput
          date={dateStart}
          maxDate={dateEnd}
          onDateChange={onStartDateChange}
        />
        <Spacing horizontal={3} />
        <FilterDateInput
          date={dateEnd}
          minDate={dateStart}
          onDateChange={onEndDateChange}
        />
      </DateRangeInputsWrapper>
    </Container>
  );
};

export default DateRangeOptions;
