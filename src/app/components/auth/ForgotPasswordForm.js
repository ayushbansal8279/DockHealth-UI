import React from 'react'
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField'

const validate = values => {
  const errors = {}

  return errors
}

const ForgotPasswordForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props
  console.log(props)
  return (
    <form onSubmit={handleSubmit}>
      <Field name='username' type='text' component={BasicField} label='Email' placeholder='Enter the email address for the account'/>
      <div className='control'>
        <button className={'button is-primary is-large' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Send reset code</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'ForgotPasswordForm',
  validate
})(ForgotPasswordForm)
