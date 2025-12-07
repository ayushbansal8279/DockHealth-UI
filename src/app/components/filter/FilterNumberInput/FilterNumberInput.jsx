import React, { useState, useEffect, useMemo } from 'react';
import { NumberInput } from './styled';

const FilterNumberInput = ({
  value,
  minValue,
  maxValue,
  setMinNumber,
  setMaxNumber,
  isMin,
  isMax,
  singleNumber,
  setSingleNumberInput,
  placeholder = '0',
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      setInputValue(String(value));
    } else {
      setInputValue('');
    }
  }, [value]);

  useEffect(() => {
    const numericValue = inputValue === '' ? null : parseFloat(inputValue);

    if (isMax) {
      setMaxNumber(numericValue);
    }
    if (isMin) {
      setMinNumber(numericValue);
    }
    if (singleNumber) {
      setSingleNumberInput(numericValue);
    }
  }, [
    inputValue,
    isMax,
    isMin,
    singleNumber,
    setMaxNumber,
    setMinNumber,
    setSingleNumberInput,
  ]);

  const hasError = useMemo(() => {
    if (inputValue === '') return false;

    const numericValue = parseFloat(inputValue);

    if (isNaN(numericValue)) return true;

    if (minValue !== null && minValue !== undefined && isMax) {
      return numericValue < minValue;
    }

    if (maxValue !== null && maxValue !== undefined && isMin) {
      return numericValue > maxValue;
    }

    return false;
  }, [minValue, maxValue, inputValue, isMin, isMax]);

  const handleInputChange = (event) => {
    const { value: v } = event.target;
    if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
      setInputValue(v);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      e.stopPropagation();
    }
  };

  return (
    <NumberInput
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      hasError={hasError}
    />
  );
};

export default FilterNumberInput;
