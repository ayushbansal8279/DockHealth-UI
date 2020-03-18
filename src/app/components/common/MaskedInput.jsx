import React from 'react';
import MaskedInput from 'react-text-mask';

const CustomMaskedInput = ({
  mask,
  input,
  label,
  id,
  type,
  disabled,
  extraClassName,
  decoratingClassName,
  meta: { touched, error },
}) => (
  <div
    className={`input-group-wrapper column large-12 ${
      touched && error ? 'has-error ' : ''
    }`}
  >
    <div className={`input-group no-icon${decoratingClassName || ''}`}>
      <div
        className={`input-wrapper form-floating-label  ${
          input.value ? 'has-value' : ''
        } ${touched && error ? 'has-error' : ''}`}
      >
        <MaskedInput
          {...input}
          id={id}
          className={
            extraClassName
              ? `input-group-field ${extraClassName}`
              : 'input-group-field'
          }
          type={type}
          disabled={disabled}
          mask={mask}
        />
        <label htmlFor={input.name}>{label}</label>

        {touched && error && <span className="form-error">{error}</span>}
      </div>
    </div>
  </div>
);

export default CustomMaskedInput;
