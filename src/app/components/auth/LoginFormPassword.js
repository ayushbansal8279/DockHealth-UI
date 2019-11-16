import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';

import AuthField from '../common/AuthField';
import {
  BottomGridContainer,
  FieldItemContainer,
  NextButton,
  StyledForm,
  StyledLabel,
  TitleTypography,
  HeightDependentGrid,
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
    const { customError, setCustomError, handleSubmit, invalid } = this.props;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
          Welcome to Dock Health
        </TitleTypography>
        <TitleTypography variant="h4">
          Please sign in to your account
        </TitleTypography>

        <FieldItemContainer>
          <HeightDependentGrid md={9} sm={12}>
            <Field
              name="username"
              type="text"
              component={AuthField}
              label="Email"
            />
          </HeightDependentGrid>
          <HeightDependentGrid md={9} sm={12}>
            <Field
              name="password"
              type="password"
              component={AuthField}
              label="Password"
              autoFocus
              customError={customError}
              setCustomError={setCustomError}
            />
          </HeightDependentGrid>
        </FieldItemContainer>

        <div>
          <HeightDependentGrid md={6} sm={12}>
            <NextButton
              active={!invalid}
              id="loginButton"
              type="submit"
              variant="contained"
              color="primary"
            >
              Next
            </NextButton>
          </HeightDependentGrid>
        </div>

        <BottomGridContainer>
          <Grid container item xs={9} direction="column" justify="flex-end">
            <StyledLabel>
              <Link to="/forgotPassword">Forgot password?</Link>
            </StyledLabel>
          </Grid>
        </BottomGridContainer>
      </StyledForm>
    );
  }
}

export default reduxForm({
  form: 'LoginFormPassword',
  validate,
})(LoginFormPassword);
