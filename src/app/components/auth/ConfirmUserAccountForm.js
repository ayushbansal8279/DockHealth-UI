import React from 'react'
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  }

  if (!values.confirmationCode) {
    errors.confirmationCode = 'Required.'
  }


  return errors
}

const ConfirmUserAccountForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting, type } = props
  console.log(props)
  return (
    <form onSubmit={handleSubmit}>
      <Field name='username' type='text' component={BasicField} label='Email' />
      <Field name='confirmationCode' type='text' component={BasicField} label='Confirmation Code' />
      <div className='control'>
        <button className={'button is-primary is-large' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>{type || 'save'}</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'ConfirmUserAccountForm',
  validate
})(ConfirmUserAccountForm)
