import React from 'react'

const BasicField = ({ input, label, type, placeholder, xlinkHref, pattern, meta: { touched, error } }) => (
  <div className={'input-group columns bottom-buffer-small large-12 ' + (xlinkHref ? '' : 'no-icon')}>
  {xlinkHref ? '<span className="input-group-label"><svg className="icon"><use xlinkHref='+xlinkHref+' ></use></svg></span>': ''}
  <div className={input.value ? 'input-wrapper form-floating-label has-value' : 'input-wrapper form-floating-label'}>
    <input {...input} className="input-group-field" type={type} pattern={pattern}/>
    <label htmlFor={input.name}>{label}</label>
  </div>
  {touched && error && <div className='help is-danger top-buffer'>{error}</div>}
  </div>
)

export default BasicField
