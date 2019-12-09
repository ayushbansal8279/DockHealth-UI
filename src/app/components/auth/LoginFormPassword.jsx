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
  } else if (!/^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(values.username)) {
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
          <HeightDependentGrid size={9}>
            <Field
              name="username"
              type="text"
              component={AuthField}
              label="Email"
            />
          </HeightDependentGrid>
          <HeightDependentGrid size={9}>
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
          <HeightDependentGrid size={6}>
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
          <StyledLabel>
            <Link to="/forgotPassword">Forgot password?</Link>
          </StyledLabel>
        </BottomGridContainer>
      </StyledForm>
    );
  }
}

export default reduxForm({
  form: 'LoginFormPassword',
  validate,
})(LoginFormPassword);
