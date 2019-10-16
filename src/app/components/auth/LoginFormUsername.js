import queryString from 'query-string';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';

import * as UserApi from '../../api/user-api';
import AuthField from '../common/AuthField';

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Please enter an email address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.username)) {
    errors.username = 'Please enter a valid email address';
  }
  return errors;
};

class LoginFormUsername extends Component {
  state = {
    showLoginMessage: false,
  };

  componentWillMount() {
    if (window.location.href) {
      const index = window.location.href.indexOf('?');
      const queryStr = window.location.href.substr(index + 1, window.location.href.length - 1);
      const queryValues = queryString.parse(queryStr);

      if (queryValues.code !== undefined) {
        this.setState({ showLoginMessage: true });
        const authCode = queryValues.code.replace('#/login', '');
        UserApi.getEnterpriseAccessTokensByAuthCode(authCode)
          .then(() => {
            window.location.href = '/#/taskList';
            this.setState({ showLoginMessage: false });
          })
          .catch((e) => {
            toggleAlert(e.message, 'error');
          });
      }
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const { showLoginMessage } = this.state;

    return (
      <form className="inline-label top-buffer" onSubmit={handleSubmit}>
        {!showLoginMessage && (
          <div className="row expanded">
            <h4>Login to your account</h4>
            <Field
              name="username"
              type="text"
              component={AuthField}
              label="Email"
              xlinkHref="#icon-email"
            />

            <div className="columns small-6 text-center top-buffer">
              <input
                id="loginButton"
                type="submit"
                className="button secondary expand"
                value="Next"
              />
            </div>
            <div className="columns small-12" style={{ marginTop: '200px' }}>
              <span>Don’t have an account yet ?</span>
              <div className="columnssmall-6 text-left details">
                <Link to="/register">Create account</Link>
              </div>
            </div>
          </div>
        )}
        {showLoginMessage && (
          <div>
            <h3>Signing you in...</h3>
            <div className="sk-circle" style={{ margin: 0 }}>
              <div className="sk-circle1 sk-child" />
              <div className="sk-circle2 sk-child" />
              <div className="sk-circle3 sk-child" />
              <div className="sk-circle4 sk-child" />
              <div className="sk-circle5 sk-child" />
              <div className="sk-circle6 sk-child" />
              <div className="sk-circle7 sk-child" />
              <div className="sk-circle8 sk-child" />
              <div className="sk-circle9 sk-child" />
              <div className="sk-circle10 sk-child" />
              <div className="sk-circle11 sk-child" />
              <div className="sk-circle12 sk-child" />
            </div>
          </div>
        )}
      </form>
    );
  }
}

export default reduxForm({
  form: 'LoginFormUsername',
  validate,
})(LoginFormUsername);
