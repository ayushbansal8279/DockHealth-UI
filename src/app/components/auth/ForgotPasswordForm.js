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

  return errors
}

const ForgotPasswordForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props
  console.log(props)
  return (
		<form className="inline-label top-buffer" onSubmit={handleSubmit}>
			<div className="row expanded">
        <Field name='username' type='text' component={AuthField} label='Email' xlinkHref="#icon-email"/>
				<div className="columns large-12 text-center top-buffer">
          <button className={'button secondary expand' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Send reset code</button>
				</div>
				<div className="columns large-12 top-buffer text-center details">
          <Link to="/login">Login if you already have an account</Link>
				</div>
			</div>
		</form>
  )
}

export default reduxForm({
  form: 'ForgotPasswordForm',
  validate
})(ForgotPasswordForm)
