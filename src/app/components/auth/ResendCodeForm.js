import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import AuthField from '../common/AuthField';

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  } else if (!/^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(values.username)) {
    errors.username = 'Invalid email address';
  }

  if (!values.confirmationCode) {
    errors.confirmationCode = 'Required';
  }

  return errors;
};

const ResendCodeForm = props => {
  const { handleSubmit, invalid, pristine, submitting } = props;

  return (
    <form className="inline-label top-buffer" onSubmit={handleSubmit}>
      <div className="row expanded">
        <Field
          name="username"
          type="text"
          component={AuthField}
          label="Email"
          xlinkHref="#icon-email"
        />
        <div className="columns small-12 text-center top-buffer">
          <button
            className={`button secondary expand${
              submitting ? ' is-loading' : ''
            }`}
            type="submit"
            disabled={invalid || pristine || submitting}
          >
            Resend code
          </button>
        </div>
        <div className="columns small-12 top-buffer text-right details">
          <Link to="/auth/confirmRegistration">Confirm registration</Link>
        </div>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'ResendCodeForm',
  validate,
})(ResendCodeForm);
