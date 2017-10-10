import React from 'react'

const BasicFieldTaskDescription = ({ input, label, id, type, placeholder, disabled, xlinkHref, extraClassName, decoratingClassName, pattern, bufferClassName, callback, priority, meta: { touched, error, visited } }) => (
  <div className={"input-group-wrapper column large-12 " + (touched && error ? 'has-error' : ' ')}>
    <h5>{touched ? "touched" : "untouched"}</h5>
    <div className="input-group icon-right icon-left">
      <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
      <div className={"input-wrapper form-floating-label " + (input.value && "has-value")}>
        <input {...input} id={id} className="input-group-field " type="text"/>
        <label>Task</label>
      </div>
      <span onClick={() => callback()} className="input-group-label"><svg className={"icon flag medium " + (priority ? "" : "no-flag")}><use xlinkHref="#icon-flag"></use></svg></span>
    </div>
    {touched && error &&
      <span className="form-error">
        {error}
      </span>
    }
  </div>
)

export default BasicFieldTaskDescription
