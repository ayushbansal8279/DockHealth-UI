import React from 'react';

const BasicFieldTaskDescription = ({
  input,
  label,
  id,
  callback,
  priority,
  meta: { touched, error },
}) => (
  <div
    className={`input-group-wrapper column large-12 ${
      touched && error ? 'has-error' : ' '
    }`}
  >
    <div className="input-group icon-right icon-left">
      <span className="input-group-label">
        <svg className="icon">
          <use xlinkHref="#icon-pencil" />
        </svg>
      </span>
      <div
        className={`input-wrapper form-floating-label ${input.value &&
          'has-value'}`}
      >
        <input {...input} id={id} className="input-group-field " type="text" />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>Task</label>
      </div>
      <span onClick={() => callback()} className="input-group-label">
        <svg className={`icon flag medium ${priority ? '' : 'no-flag'}`}>
          <use xlinkHref="#icon-flag" />
        </svg>
      </span>
    </div>
    {touched && error && <span className="form-error">{error}</span>}
  </div>
);

export default BasicFieldTaskDescription;
