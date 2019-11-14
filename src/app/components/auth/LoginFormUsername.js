import Grid from '@material-ui/core/Grid';
import queryString from 'query-string';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';

import * as UserApi from '../../api/user-api';
import AuthField from '../common/AuthField';
import {
  BottomGridContainer,
  FieldItemContainer,
  NextButton,
  StyledLabel,
  TitleTypography,
  StyledForm,
} from './AuthComponents.styled';

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Please enter an email address';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.username)
  ) {
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
      const queryStr = window.location.href.substr(
        index + 1,
        window.location.href.length - 1,
      );
      const queryValues = queryString.parse(queryStr);

      if (queryValues.code !== undefined) {
        this.setState({ showLoginMessage: true });
        const authCode = queryValues.code.replace('#/login', '');
        UserApi.getEnterpriseAccessTokensByAuthCode(authCode)
          .then(() => {
            window.location.href = '/#/taskList';
            this.setState({ showLoginMessage: false });
          })
          .catch(e => {
            toggleAlert(e.message, 'error');
          });
      }
    }
  }

  render() {
    const { handleSubmit, invalid } = this.props;
    const { showLoginMessage } = this.state;

    return (
      <StyledForm onSubmit={handleSubmit}>
        {!showLoginMessage && (
          <>
            <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
              Welcome to Dock Health
            </TitleTypography>
            <TitleTypography variant="h4">
              Please sign in to your account
            </TitleTypography>

            <FieldItemContainer>
              <Grid item md={9} sm={12}>
                <Field
                  name="username"
                  type="text"
                  component={AuthField}
                  label="Email"
                  autoFocus
                />
              </Grid>
            </FieldItemContainer>

            <div>
              <Grid item xs={6}>
                <NextButton
                  active={!invalid}
                  id="loginButton"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Next
                </NextButton>
              </Grid>
            </div>
            <BottomGridContainer>
              <Grid container item xs={9} direction="column" justify="flex-end">
                <StyledLabel bold>Don’t have an account yet?</StyledLabel>
                <StyledLabel>
                  <Link to="/register">Create account</Link>
                </StyledLabel>
              </Grid>
            </BottomGridContainer>
          </>
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
      </StyledForm>
    );
  }
}

export default reduxForm({
  form: 'LoginFormUsername',
  validate,
})(LoginFormUsername);
