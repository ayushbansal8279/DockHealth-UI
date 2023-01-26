import React from 'react';
import { StyledInitialsInput } from './styled';

const InitialsInput = React.forwardRef(
  (
    { name, placeholder, onChange, backgroundColor, value, size, maxChar = 3 },
    reference,
  ) => {
    const handleInputChange = (event) => {
      const newValue = event.target.value.trim();
      if (newValue.length <= maxChar) {
        onChange(newValue);
      }
    };

    return (
      <StyledInitialsInput
        ref={reference}
        name={name}
        placeholder={placeholder?.toUpperCase()}
        backgroundColor={backgroundColor}
        onChange={handleInputChange}
        value={value?.toUpperCase()}
        size={size}
      />
    );
  },
);

export default InitialsInput;
