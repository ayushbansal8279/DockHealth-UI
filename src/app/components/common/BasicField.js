import React from 'react'

const BasicField = ({ input, label, id, type, placeholder,disabled, xlinkHref, extraClassName, decoratingClassName, pattern, meta: { touched, error } }) => (
  <div className={"input-group-wrapper column large-12 " + (xlinkHref && touched && error && 'has-error')}>
    <div className={'input-group ' + (xlinkHref ? '' : 'no-icon ') + (decoratingClassName? decoratingClassName : '')}>

      {/* icon   */}
      {xlinkHref &&
        <span className="input-group-label"><svg className="icon"><use xlinkHref={xlinkHref}></use></svg></span>
      }

      {/* has input value (like when editing) makes label float */}
      <div className={input.value ?
        'input-wrapper form-floating-label has-value ' + (!xlinkHref && touched && error && 'has-error') :
        'input-wrapper form-floating-label ' + (!xlinkHref && touched && error && 'has-error')}>


        <input {...input} id={id} className={extraClassName? "input-group-field " + extraClassName : "input-group-field"} type={type} pattern={pattern} disabled={disabled}/>
        <label htmlFor={input.name}>{label}</label>

        {/* if touched and has error */}
        {!xlinkHref && touched && error &&
          <span className="form-error">
            {error}
          </span>
        }
      </div>

    </div>
    {xlinkHref && touched && error &&
      <span className="form-error">
        {error}
      </span>
    }
  </div>
)

export default BasicField
