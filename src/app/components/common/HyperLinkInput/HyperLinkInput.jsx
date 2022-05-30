import React from 'react';
import Input from '../Input/Input';

export default function HyperLinkInput({
  placeholder,
  value,
  onBlur,
  label,
  onChange,
  inputRef,
  ...otherProps
}) {
  const handleBlur = () => {
    onBlur();
    console.log(value);
  };
  console.log(otherProps);
  return (
    <>
      <Input
        label={label}
        value={value}
        ref={inputRef}
        onChange={onChange}
        placeholder={placeholder}
        onBlur={handleBlur}
        error
      />
    </>
  );
}
