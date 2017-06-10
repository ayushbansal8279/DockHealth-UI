import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router'
import AuthField from '../common/AuthField'

const validate = values => {
  const errors = {}
  if (!values.mfaCode) {
    errors.mfaCode = 'Required'
  }
  return errors
}

const ConfirmMFACodeForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting, type } = props
  console.log(props)
  return (
		<form className="inline-label top-buffer" onSubmit={handleSubmit}>
			<div className="row expanded">
        <Field name='mfaCode' type='text' component={AuthField} label='Enter authentication code' xlinkHref="#icon-password"/>
				<div className="columns large-12 text-center top-buffer">
          <button className={'button secondary expand' + (submitting ? ' is-loading' : '')} type='submit' disabled={invalid || pristine || submitting}>Confirm</button>
				</div>
				<div className="columns large-12 top-buffer text-center details">
          <Link to="/login">Login if you already have an account</Link>
				</div>

			</div>
		</form>
  )
}

export default reduxForm({
  form: 'ConfirmMFACodeForm',
  validate
})(ConfirmMFACodeForm)
