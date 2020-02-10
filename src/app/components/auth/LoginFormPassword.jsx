import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import AuthFieldHooks from '../common/AuthFieldHooks';
import {
  BottomGridContainer,
  FieldItemContainer,
  HeightDependentGrid,
  NextButton,
  StyledForm,
  StyledLabel,
  TitleTypography,
} from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
  password: string().required('Please enter a password'),
});

const LoginFormPassword = ({ onSubmit }) => {
  const formMethods = useForm({
    validationSchema,
  });

  const { handleSubmit, setError, setValue } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit({ setError }))}>
      <FormContext {...formMethods}>
        <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
          Welcome to Dock Health
        </TitleTypography>
        <TitleTypography variant="h4">
          Please sign in to your account
        </TitleTypography>

        <FieldItemContainer>
          <HeightDependentGrid size={9}>
            <AuthFieldHooks name="username" type="text" label="Email" />
          </HeightDependentGrid>
          <HeightDependentGrid size={9}>
            <AuthFieldHooks
              name="password"
              type="password"
              label="Password"
              autoFocus
            />
          </HeightDependentGrid>
        </FieldItemContainer>

        <div>
          <HeightDependentGrid size={6}>
            <NextButton
              active
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
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormPassword;
