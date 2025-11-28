import React from 'react';
import Spacing from 'components/common/Spacing';
import FilterNumberInput from '../FilterNumberInput/FilterNumberInput';
import { NumberRangeInputsWrapper } from './styled';

const NumberRangeOptions = ({
  minValue,
  maxValue,
  setMinNumber,
  minNumber,
  setMaxNumber,
  maxNumber,
}) => {
  return (
    <NumberRangeInputsWrapper>
      <FilterNumberInput
        isMin
        minNumber={minNumber}
        setMinNumber={setMinNumber}
        value={minValue}
        maxValue={maxNumber}
        placeholder="Min"
      />
      <Spacing horizontal={3} />
      <FilterNumberInput
        isMax
        maxNumber={maxNumber}
        setMaxNumber={setMaxNumber}
        value={maxValue}
        minValue={minNumber}
        placeholder="Max"
      />
    </NumberRangeInputsWrapper>
  );
};

export default NumberRangeOptions;

