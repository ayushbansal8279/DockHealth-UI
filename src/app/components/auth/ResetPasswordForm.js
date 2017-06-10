import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router'
import AuthField from '../common/AuthField'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
    errors.username = 'Invalid email address'
  }

  if (!values.verificationCode) {
    errors.verificationCode = 'Required'
  }

  if (!values.password) {
    errors.password = 'Required'
  }

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
		<form className="inline-label top-buffer" onSubmit={handleSubmit}>
			<div className="row expanded">
        <Field name='username' type='text' component={AuthField} label='Email' xlinkHref="#icon-email"/>
        <Field name='verificationCode' type='text' component={AuthField} label='Verification code' xlinkHref="#icon-password"/>
        <Field name='password' type='password' component={AuthField} label='New password' xlinkHref="#icon-password"/>
				<div className="columns large-12 text-center top-buffer">
          <button className={'button secondary expand' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Reset password</button>
				</div>
				<div className="columns large-12 top-buffer text-center details">
          <Link to="/login">Login if you already have an account</Link>
				</div>
			</div>
		</form>
  )
}

export default reduxForm({
  form: 'ResetPasswordForm',
  validate
})(ResetPasswordForm)
