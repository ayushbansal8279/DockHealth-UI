import Grid from '@material-ui/core/Grid';
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';

import AuthField from '../common/AuthField';
import { NextButton, StyledLabel, TitleTypography } from './AuthComponents.styled';

const validate = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = 'Please enter a password';
  }

  return errors;
};

class LoginFormPassword extends PureComponent {
  passwordInput = React.createRef();

  componentDidMount = () => {
    // eslint-disable-next-line no-unused-expressions
    this.passwordInput.current?.focus();
  };

  render() {
    const { handleSubmit, invalid } = this.props;

    return (
      <form className="inline-label top-buffer" onSubmit={handleSubmit}>
        <Grid container>
          <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
            Welcome to Dock Health
          </TitleTypography>
          <TitleTypography variant="h4">Please sign in to your account</TitleTypography>
          <Grid item xs={12}>
            <Field
              name="username"
              type="text"
              component={AuthField}
              marginTop="2.5rem"
              label="Email"
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="password"
              type="password"
              component={AuthField}
              marginTop="0.5rem"
              label="Password"
            />
          </Grid>

          <Grid item xs={6}>
            <NextButton
              active={!invalid}
              id="loginButton"
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginTop: '0.5rem',
              }}
            >
              Next
            </NextButton>
          </Grid>
          <Grid item xs={12}>
            <StyledLabel marginTop>
              <Link to="/forgotPassword">Forgot password?</Link>
            </StyledLabel>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default reduxForm({
  form: 'LoginFormPassword',
  validate,
})(LoginFormPassword);
