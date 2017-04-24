import React from 'react'
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required.'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
    errors.username = 'Invalid email address.'
  }

  if (!values.password) {
    errors.password = 'Required.'
  }

  return errors
}

const FormLogin = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className="row column">
        <Field name='username' type='text' component={BasicField} label='Email' placeholder="somebody@example.com"/>
        <Field name='password' type='password' component={BasicField} label='Password' />
        {/*<Field name='show-password' type='checkbox' component={BasicField} label='Show password' />*/}
        <p><button className={'button is-primary is-large'} type='submit'>Login</button></p> 
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'FormLogin',
  validate
})(FormLogin)
