import React from 'react';
import {
  ArrowsWrapper,
  UpArrow,
  DownArrow,
  InputWrapper,
  NumberInput,
} from './styled';

const SecondaryNumberInput = ({ name, value, onChange }) => {
  const increment = () => {
    const newValue = !value ? 1 : value + 1;
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = !value ? -1 : value - 1;
    onChange(newValue);
  };

  return (
    <InputWrapper>
      <NumberInput
        name={name}
        type="number"
        value={value}
        onChange={event => onChange(event.target?.value || 0)}
      />
      <ArrowsWrapper>
        <UpArrow type="button" onClick={increment} />
        <DownArrow type="button" onClick={decrement} />
      </ArrowsWrapper>
    </InputWrapper>
  );
};

export default SecondaryNumberInput;
