import React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const DatePickerInput = ({
  input,
  label,
  id,
  dateFormat,
  disabled,
  xlinkHref,
  extraClassName,
  decoratingClassName,
  bufferClassName,
  meta: { touched, error },
}) => (
  <div
    className={`input-group-wrapper column large-12 ${
      xlinkHref && touched && error ? 'has-error ' : ' '
    }${bufferClassName ? ` ${bufferClassName}` : ''}`}
  >
    <div className={`input-group ${xlinkHref ? '' : 'no-icon '}${decoratingClassName || ''}`}>
      {xlinkHref && (
        <span className="input-group-label">
          <svg className="icon">
            <use xlinkHref={xlinkHref} />
          </svg>
        </span>
      )}

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
        <DatePicker
          onChange={input.onChange}
          id={id}
          className={extraClassName ? `input-group-field ${extraClassName}` : 'input-group-field'}
          type="text"
          disabled={disabled}
          selected={input.value ? input.value : null}
          showTimeSelect
          timeFormat="h:mm a"
          timeIntervals={30}
          dateFormat={dateFormat}
          timeCaption="time"
          popperPlacement="right-end"
          popperModifiers={{
            offset: {
              enabled: true,
              offset: '2px, 5px',
            },
            preventOverflow: {
              enabled: true,
              escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
              boundariesElement: 'viewport',
            },
          }}
        />
        <label htmlFor={input.name}>{label}</label>

        {!xlinkHref && touched && error && <span className="form-error">{error}</span>}
      </div>
    </div>
    {xlinkHref && touched && error && <span className="form-error">{error}</span>}
  </div>
);

export default DatePickerInput;
