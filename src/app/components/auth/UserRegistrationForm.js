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
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Required'
  } else if (values.phoneNumber.length != 10) {
    errors.phoneNumber = 'Must be 10 characters'
  }

  if (!values.password) {
    errors.password = 'Required'
  }
  if (!values.password2) {
    errors.password2 = 'Required'
  }
  if (values.password !== values.password2) {
    errors.password2 = 'Must match password'
  }
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }

  return errors
}

const UserRegistrationForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting, type } = props
  console.log(props)
  return (
		<form className="inline-label top-buffer white-bg" onSubmit={handleSubmit}>
			<div className="row expanded">
        <Field name='firstName' type='text' component={AuthField} label='First name' />
        <Field name='lastName' type='text' component={AuthField} label='Last name' />
        <Field name='username' type='email' component={AuthField} label='Email' />
        <Field name='phoneNumber' type='tel' component={AuthField} label='Your mobile phone #' pattern='\d{10}'/>
        <Field name='password' type='password' component={AuthField} label='Password' />
        <Field name='password2' type='password' component={AuthField} label='Confirm password' />
				<div className="columns large-12 text-center top-buffer">
					<button className={'button secondary expand' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Continue</button>
				</div>
				<div className="columns top-buffer large-6 text-left details">
          I already have an account. <Link to="/login">Sign in</Link>.
				</div>
				<div className="columns large-6 top-buffer text-right details">
          <Link to="/confirmRegistration">Confirm registration</Link>
				</div>

			</div>
		</form>
  )
}

export default reduxForm({
  form: 'UserRegistrationForm',
  validate
})(UserRegistrationForm)
