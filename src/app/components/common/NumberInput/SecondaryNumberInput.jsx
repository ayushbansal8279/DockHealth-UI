import React from 'react';
import {
  ArrowsWrapper,
  UpArrow,
  DownArrow,
  InputWrapper,
  NumberInput,
} from './styled';

const SecondaryNumberInput = ({ name, value, onChange, onBlur }) => {
  const increment = () => {
    const newValue = !value ? 1 : Number(value) + 1;
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = !value ? -1 : Number(value) - 1;
    onChange(newValue);
  };

  return (
    <InputWrapper>
      <NumberInput
        name={name}
        type="number"
        value={value}
        onChange={(event) => {
          if (typeof onChange === 'function') onChange(event.target?.value);
        }}
        onBlur={(event) => {
          if (typeof onBlur === 'function') onBlur(event);
        }}
      />
      <ArrowsWrapper>
        <UpArrow type="button" onClick={increment} />
        <DownArrow type="button" onClick={decrement} />
      </ArrowsWrapper>
    </InputWrapper>
  );
};

export default SecondaryNumberInput;
