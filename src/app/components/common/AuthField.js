import React from 'react'

const AuthField = ({ input, label, type, placeholder, xlinkHref, pattern, meta: { touched, error } }) => (
  <div className={'input-group-wrapper columns top-buffer small-12 '+(touched && error && 'has-error ')}>
    <div className={'input-group ' + (xlinkHref ? '' : 'no-icon')}>
      {xlinkHref &&
        <span className="input-group-label"><svg className="icon"><use xlinkHref={xlinkHref}></use></svg></span>
      }
      <div className="input-wrapper form-floating-label">
        <input {...input} className="input-group-field " type={type} pattern={pattern} id={input.name}/>
        <label htmlFor={input.name}>{label}</label>
      </div>
    </div>
    {/* if touched and has error */}
      {touched && error &&
        <span className="form-error">
          {error}
        </span>
      }
  </div>
)

export default AuthField
