import React, { Component } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';

import AuthFieldAutoFocus from '../common/AuthFieldAutoFocus';

const validate = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = 'Please enter a password';
  }

  return errors;
};

class LoginFormPassword extends Component {
  constructor(props) {
    super(props);
    this.passwordInput = null;
  }

  componentDidMount() {
    this.passwordInput.focus();
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="inline-label top-buffer" onSubmit={handleSubmit}>
        <div className="row expanded">
          <h5>Please enter your password</h5>
          <Field
            name="password"
            type="password"
            component={AuthFieldAutoFocus}
            label=""
            xlinkHref="#icon-password"
            setFieldToBeFocused={(input) => {
              this.passwordInput = input;
            }}
          />
          <div className="columns small-6 text-center top-buffer">
            <input
              id="loginButton"
              type="submit"
              className="button secondary expand"
              value="Login"
            />
          </div>

          <div className="columns small-12" style={{ marginTop: '200px' }}>
            <div className="small-6 text-left details">
              <Link to="/forgotPassword">Forgot password ?</Link>
            </div>
            <div className="small-6 text-left details top-buffer">
              <Link to="/login">Re-enter Email</Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'LoginFormPassword',
  validate,
})(LoginFormPassword);
