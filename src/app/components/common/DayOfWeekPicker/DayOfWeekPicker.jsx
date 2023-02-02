import React from 'react';
import { DayButton, Wrapper } from './styled';
import { DayOfWeek, DayOfWeekLabel } from './helper';

const DayOfWeekPicker = ({ disabled, onSelect, values }) => {
  const handleSelect = (selectedValue) => {
    if (!values) {
      onSelect([selectedValue]);
    } else if (values.includes(selectedValue)) {
      onSelect(values.filter((v) => v !== selectedValue));
    } else {
      onSelect([...values, selectedValue]);
    }
  };

  return (
    <Wrapper>
      {Object.values(DayOfWeek).map((value) => (
        <DayButton
          key={value}
          type="button"
          disabled={disabled}
          isSelected={values?.includes(value)}
          onClick={() => handleSelect(value)}
        >
          {DayOfWeekLabel[value]}
        </DayButton>
      ))}
    </Wrapper>
  );
};

export default DayOfWeekPicker;
