import React from 'react';
import ReactSelect from 'react-select';

const SelectInput = ({
  input,
  label,
  options,
  id,
  type,
  disabled,
  xlinkHref,
  extraClassName,
  decoratingClassName,
  pattern,
  bufferClassName,
  meta: { touched, error },
}) => (
  <div
    className={`input-group-wrapper column large-12 ${
      xlinkHref && touched && error ? 'has-error ' : ' '
    }${bufferClassName ? ` ${bufferClassName}` : ''}`}
  >
    <div
      className={`input-group ${xlinkHref ? '' : 'no-icon '}${decoratingClassName || ''}`}
      style={{ height: 60 }}
    >
      {/* icon   */}
      {xlinkHref && (
        <span className="input-group-label">
          <svg className="icon">
            <use xlinkHref={xlinkHref} />
          </svg>
        </span>
      )}

      {/* has input value (like when editing) makes label float */}
      <div
        className={
          input.value
            ? `input-wrapper form-floating-label has-value ${!xlinkHref
                && touched
                && error
                && 'has-error'}`
            : `input-wrapper form-floating-label ${!xlinkHref && touched && error && 'has-error'}`
        }
      >
        <ReactSelect
          {...input}
          options={options}
          value={options.find(el => el.value === input.value)}
          onChange={val => val.value}
          id={id}
          className={extraClassName ? `input-group-field ${extraClassName}` : 'input-group-field'}
          type={type}
          placeholder=""
          pattern={pattern}
          disabled={disabled}
          styles={{
            container: provided => ({
              ...provided,
              margin: 0,
            }),
            control: provided => ({
              ...provided,
              height: 60,
              borderLeft: 0,
              borderRadius: 0,
              borderColor: '#ededf0',
            }),
          }}
        />
        <label htmlFor={input.name}>{label}</label>

        {/* if touched and has error */}
        {!xlinkHref && touched && error && <span className="form-error">{error}</span>}
      </div>
    </div>
    {xlinkHref && touched && error && <span className="form-error">{error}</span>}
  </div>
);

export default SelectInput;
