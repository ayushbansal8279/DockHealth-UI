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
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Required'
  } else if (values.phoneNumber.length != 10) {
    errors.phoneNumber = 'Must be 10 characters'
  }

  if (!values.password) {
    errors.password = 'Required.'
  }
  if (!values.password2) {
    errors.password2 = 'Required.'
  }
  if (values.password !== values.password2) {
    errors.password2 = 'Must match password.'
  }
  if (!values.firstName) {
    errors.firstName = 'Required.'
  }
  if (!values.lastName) {
    errors.lastName = 'Required.'
  }

  return errors
}

const UserRegistrationForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting, type } = props
  console.log(props)
  return (
        <form onSubmit={handleSubmit}>
          <div className="row column">
            <Field name='username' type='text' component={BasicField} label='Email address' />
            <Field name='phoneNumber' type='tel' component={BasicField} label='Your mobile phone #' pattern='\d{10}'/>
            <Field name='password' type='password' component={BasicField} label='Password' />
            <Field name='password2' type='password' component={BasicField} label='Confirm Password' />
            <Field name='firstName' type='text' component={BasicField} label='First name' />
            <Field name='lastName' type='text' component={BasicField} label='Last name' />
            {/*<Field name='specialty' type='text' component={BasicField} label='Specialty' />
            <Field name='subspecialty' type='text' component={BasicField} label='Subspecialty' />
            <Field name='title' type='text' component={BasicField} label='Title' />*/}
            <p><button className={'button is-primary is-large' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>{type || 'save'}</button></p>
            
          </div>
        </form>
  )
}

export default reduxForm({
  form: 'UserRegistrationForm',
  validate
})(UserRegistrationForm)
