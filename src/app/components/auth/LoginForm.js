import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import AuthField from '../common/AuthField';

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Please enter an email address';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.username)
  ) {
    errors.username = 'Please enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Please enter a password';
  }

  return errors;
};

const LoginForm = props => {
  const { handleSubmit } = props;
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
        <Field
          name="password"
          type="password"
          component={AuthField}
          label="Password"
          xlinkHref="#icon-password"
        />
        <div className="columns small-12 text-right details">
          <Link to="/forgotPassword">Forgot password?</Link>
        </div>

        <div className="columns small-12 text-center top-buffer">
          <input
            id="loginButton"
            type="submit"
            className="button secondary expand"
            value="Login"
          />
          {/* <p><button className={'button is-primary is-large'} type='submit'>Login</button></p> */}
        </div>
        <div className="columns top-buffer small-6 text-left details">
          <Link to="/register">Create account</Link>
        </div>
        <div className="columns small-6 top-buffer text-right details">
          <Link to="/confirmRegistration">Confirm registration</Link>
        </div>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'LoginForm',
  validate,
})(LoginForm);
