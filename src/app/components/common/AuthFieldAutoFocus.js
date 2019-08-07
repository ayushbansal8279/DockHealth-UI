import React from 'react'

const AuthFieldAutoFocus = ({ input, label, type, placeholder, xlinkHref, pattern, extraClass, meta: { touched, error },
    setFieldToBeFocused = () => {} }) => (
  <div className={'input-group-wrapper column top-buffer small-12 '+(touched && error && 'has-error ') + ' ' + extraClass}>
    <div className={'input-group ' + (xlinkHref ? '' : 'no-icon')}>
      {xlinkHref &&
        <span className="input-group-label"><svg className="icon"><use xlinkHref={xlinkHref}></use></svg></span>
      }
      <div className="input-wrapper form-floating-label">
        <input {...input} className="input-group-field " type={type} pattern={pattern} id={input.name} ref={input => setFieldToBeFocused(input)}/>
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

export default AuthFieldAutoFocus
