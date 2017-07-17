import React from 'react'

const BasicFieldTaskDescription = ({ isTaskDescription, input, label, id, type, placeholder,disabled, xlinkHref, extraClassName, decoratingClassName, pattern, meta: { touched, error } }) => (

  <div className="input-group-wrapper column large-12">
    {/* This wrapper should only go around the task description field */}
    <div className="input-group icon-right icon-left">
      {/* icon   */}
      <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>

      {/* has input value (like when editing) makes label float */}
      <div className={"input-wrapper form-floating-label " + (input.value && 'has-value ') + (touched && error && 'has-error')}>
        <input {...input} id={id} className={extraClassName? "input-group-field " + extraClassName : "input-group-field"} type={type} pattern={pattern} disabled={disabled}/>
        <label htmlFor={input.name}>{label}</label>
      </div>
      <span className="input-group-label"><svg className="icon flag no-flag medium"><use xlinkHref="#icon-flag"></use></svg></span>
    </div>

        {/* if touched and has error */}
        {touched && error &&
          <span className="form-error">
            {error}
          </span>
        }

  </div>
)

export default BasicFieldTaskDescription
