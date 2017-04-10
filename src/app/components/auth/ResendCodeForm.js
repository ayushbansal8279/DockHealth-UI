import React from 'react'
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField'

const validate = values => {
  const errors = {}

  return errors
}

const ResendCodeForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props
  console.log(props)
  return (
    <form onSubmit={handleSubmit}>
      <Field name='username' type='text' component={BasicField} label='username' />
      <div className='control'>
        <button className={'button is-primary is-large' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Resend Code</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'ResendCodeForm',
  validate
})(ResendCodeForm)
