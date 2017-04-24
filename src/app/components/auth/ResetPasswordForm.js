import React from 'react'
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField'

const validate = values => {
  const errors = {}

  return errors
}

const ResetPasswordForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props
  console.log(props)
  //props.initialValues = {username: username, verificationCode: verificationCode}
  //props.initialValues.username = username
  //props.initialValues.verificationCode = verificationCode
  console.log(props.initialValues)

  return (
    <form onSubmit={handleSubmit}>
      <Field name='username' type='text' component={BasicField} label='Email' placeholder='Enter the email used to create the account'/>
      <Field name='verificationCode' type='text' component={BasicField} label='Verification Code'/>
      <Field name='password' type='password' component={BasicField} label='New Password' />
      <div className='control'>
        <button className={'button is-primary is-large' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Reset Password</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'ResetPasswordForm',
  validate
})(ResetPasswordForm)
