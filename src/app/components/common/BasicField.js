import React from 'react'

const BasicField = ({ input, label, type, placeholder, pattern, meta: { touched, error } }) => (
  <div className='control'>
    <label htmlFor={input.name} >{label}</label>
    <input className='input is-large' {...input} placeholder={(placeholder?placeholder:label)} type={type} pattern={pattern}/>
    {touched && error && <div className='help is-danger'>{error}</div>}
  </div>
)

export default BasicField
