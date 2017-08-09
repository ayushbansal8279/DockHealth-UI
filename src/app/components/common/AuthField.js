import React from 'react'

const AuthField = ({ input, label, type, placeholder, xlinkHref, pattern, meta: { touched, error } }) => (
  <div className={'input-group columns bottom-buffer-small small-12 ' + (xlinkHref ? '' : 'no-icon')}>
  <span className="input-group-label"><svg className="icon"><use xlinkHref={xlinkHref} ></use></svg></span>
  <div className="input-wrapper form-floating-label">
    <input {...input} className="input-group-field" type={type} pattern={pattern}/>
    <label htmlFor={input.name}>{label}</label>
  </div>
  {touched && error && <div className='help is-danger top-buffer'>{error}</div>}
  </div>
)

export default AuthField
