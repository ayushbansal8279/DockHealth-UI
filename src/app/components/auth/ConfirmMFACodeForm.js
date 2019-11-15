import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import AuthField from '../common/AuthField';
import { NextButton, TitleTypography } from './AuthComponents.styled';

const validate = values => {
  const errors = {};
  if (!values.mfaCode) {
    errors.mfaCode = 'Required';
  }
  return errors;
};

const ConfirmMFACodeForm = props => {
  const { handleSubmit, invalid, pristine, submitting } = props;

  return (
    <form className="inline-label top-buffer" onSubmit={handleSubmit}>
      <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
        Welcome to Dock Health
      </TitleTypography>
      <Grid item sm={12} md={9}>
        <TitleTypography variant="h4">
        Enter the six digit authentication code that was sent to your cell phone
        </TitleTypography>
      </Grid>
      <Grid item sm={12} md={9}>
        <Field
          marginTop="1.5rem"
          name="mfaCode"
          type="text"
          component={AuthField}
          label="Authentication code"
          autoFocus
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
            marginTop: '3rem',
          }}
        >
          Confirm
        </NextButton>
      </Grid>
    </form>
  );
};

export default reduxForm({
  form: 'ConfirmMFACodeForm',
  validate,
})(ConfirmMFACodeForm);
