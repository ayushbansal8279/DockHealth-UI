import React, { useRef, useEffect, useState } from 'react';
import { hashHistory } from 'react-router';
import Spacing from 'components/common/Spacing';
import { FormContext, useForm, useFieldArray } from 'react-hook-form';
import { object, string, array } from 'yup';
import { Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import Input from 'components/common/Input/Input';
import {
  ViewContainer,
  Title,
  Description,
  StyledForm,
  AddPersonButton,
} from './styled';

const REQUIRED_MESSAGE = 'This filed is reqiered';

const formSchema = {
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('This field should contain a valid email address'),
};

const fieldsSchema = object().shape({
  organizationMembers: array().of(object().shape(formSchema)),
});

const onSubmit = data => {
  console.log('data', data);
  hashHistory.push('/');
};

const OnboardingTeamSetupView = () => {
  // const lastFirstNameFieldReference = useRef(null);
  const [
    lastFirstNameFieldReference,
    setLastFirstNameFieldReference,
  ] = useState(null);
  const firstFirstNameFieldReference = useRef(null);

  useEffect(() => {
    if (lastFirstNameFieldReference) {
      lastFirstNameFieldReference.focus();
    }
  }, [lastFirstNameFieldReference]);

  useEffect(() => {
    if (firstFirstNameFieldReference.current) {
      firstFirstNameFieldReference.current.focus();
    }
  }, [firstFirstNameFieldReference]);

  const formMethods = useForm({
    validationSchema: fieldsSchema,
    mode: 'onSubmit',
    defaultValues: {
      organizationMembers: [
        { id: 0, firstName: '', lastName: '', email: '' },
        { id: 1, firstName: '', lastName: '', email: '' },
        { id: 2, firstName: '', lastName: '', email: '' },
      ],
    },
  });

  const { handleSubmit, control, register, errors } = formMethods;

  const { fields, append } = useFieldArray({
    control,
    name: 'organizationMembers',
  });

  return (
    <ViewContainer>
      <Title>Bring your team together on Dock!</Title>
      <Description>
        Dock is designed specifically to help all your team members collaborate
        better on patient care. Just use this page to invite colleagues. You can
        add as many as you want.
      </Description>
      <Spacing vertical={5} />
      <FormContext {...formMethods}>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => (
            <div key={item.id}>
              {index !== 0 && <Spacing vertical={5} />}
              <Grid container direction="row" alignItems="flex-end" spacing={3}>
                <Grid item xs={3}>
                  <Input
                    ref={element => {
                      register(element);
                      if (!firstFirstNameFieldReference.current) {
                        firstFirstNameFieldReference.current = element;
                      }
                      if (index === fields.length - 1 && fields.length > 3) {
                        setLastFirstNameFieldReference(element);
                      }
                    }}
                    type="text"
                    name={`organizationMembers[${index}].firstName`}
                    placeholder="FIRST NAME"
                    required
                    showError
                    styling="secondary"
                    error={
                      errors?.organizationMembers?.[index]?.firstName?.message
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <Input
                    ref={register}
                    type="text"
                    name={`organizationMembers[${index}].lastName`}
                    placeholder="LAST NAME"
                    required
                    showError
                    styling="secondary"
                    error={
                      errors?.organizationMembers?.[index]?.lastName?.message
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Input
                    ref={register}
                    type="text"
                    name={`organizationMembers[${index}].email`}
                    placeholder="EMAIL"
                    required
                    showError
                    styling="secondary"
                    error={errors?.organizationMembers?.[index]?.email?.message}
                  />
                </Grid>
              </Grid>
            </div>
          ))}
          <Spacing vertical={5} />
          <AddPersonButton
            type="button"
            onClick={() =>
              append({
                id: fields.length,
                firstName: '',
                lastName: '',
                email: '',
              })
            }
          >
            + add another person
          </AddPersonButton>
          <Spacing vertical={5} />
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Button fullWidth type="submit">
                Send invite
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                type="button"
                variant="text"
                onClick={() => hashHistory.push('/')}
              >
                Skip
              </Button>
            </Grid>
          </Grid>
        </StyledForm>
      </FormContext>
    </ViewContainer>
  );
};

export default OnboardingTeamSetupView;
