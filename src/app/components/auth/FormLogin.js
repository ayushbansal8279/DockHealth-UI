import React from 'react'
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }

  if (!values.password) {
    errors.password = 'Required.'
  }

  return errors
}

const FormLogin = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props
  return (
    <div className="row log-in-form">
      <div className="medium-10 medium-centered large-10 large-centered columns">
        <form onSubmit={handleSubmit}>
          <div className="row column">
            <h4 className="text-center">Log in with you email account</h4>
            <Field name='username' type='text' component={BasicField} label='Email' placeholder="somebody@example.com"/>
            <Field name='password' type='password' component={BasicField} label='Password' />
            <input id="show-password" type="checkbox"/><label for="show-password">Show password</label>
            <p><button className={'button is-primary is-large'} type='submit'>Log In</button></p>
            <p className="text-center"><a href="#">Forgot your password?</a></p>   
          </div>
        </form>
      </div>
    </div>    
  )
}

export default reduxForm({
  form: 'FormLogin',
  validate
})(FormLogin)
