import React from 'react'

const BasicField = ({ input, label, id, type, placeholder, xlinkHref, extraClassName, decoratingClassName, pattern, meta: { touched, error } }) => (
  <div className={'column large-12 input-group ' + (xlinkHref ? '' : 'no-icon') + (decoratingClassName? decoratingClassName : '')}>
  {
    xlinkHref && <span className="input-group-label"><svg className="icon"><use xlinkHref={xlinkHref}></use></svg></span>
  }
  <div className={input.value ? 'input-wrapper form-floating-label has-value' : 'input-wrapper form-floating-label'}>
    <input {...input} id={id} className={extraClassName? "input-group-field " + extraClassName : "input-group-field"} type={type} pattern={pattern}/>
    <label htmlFor={input.name}>{label}</label>
  </div>
  {touched && error && <div className='help is-danger top-buffer'>{error}</div>}
  </div>
)

export default BasicField

