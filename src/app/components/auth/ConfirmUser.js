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

const ConfirmUser = (props) => {
  const { handleSubmit, invalid, pristine, submitting, type } = props
  console.log(props)
  return (
    <form onSubmit={handleSubmit}>
      <Field name='username' type='text' component={BasicField} label='Username' />
      <Field name='confirmationCode' type='text' component={BasicField} label='Confirmation Code' />
      <div className='control'>
        <button className={'button is-primary is-large' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>{type || 'save'}</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'ConfirmUser',
  validate
})(ConfirmUser)
