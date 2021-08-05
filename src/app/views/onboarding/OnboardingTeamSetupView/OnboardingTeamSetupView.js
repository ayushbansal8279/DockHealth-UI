/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import Spacing from 'components/common/Spacing';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import { FormContext, useForm, useFieldArray } from 'react-hook-form';
import { object, string, array } from 'yup';
import { Grid } from '@material-ui/core';
import { checkBAASignedStatus } from 'actions/organization-actions';
import { openModal } from 'modal/actions';
import { invitePersonToOrganization } from 'api/people-api';
import Button from 'components/common/Button/Button';
import Input from 'components/common/Input/Input';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import {
  ViewContainer,
  Title,
  Description,
  StyledForm,
  AddPersonButton,
  FormErrorText,
  FieldStatusLabel,
} from './styled';

const renderSingleInviteLabel = isSuccess =>
  isSuccess ? (
    <FieldStatusLabel>Invite sent</FieldStatusLabel>
  ) : (
    <FieldStatusLabel isError>Invite failed</FieldStatusLabel>
  );

const REQUIRED_MESSAGE = 'This filed is reqiered';

const formSchema = {
  firstName: string().when(['lastName', 'email'], {
    is: (lastName, email) => lastName || email,
    then: string().required(REQUIRED_MESSAGE),
  }),
  lastName: string().when(['firstName', 'email'], {
    is: (firstName, email) => firstName || email,
    then: string().required(REQUIRED_MESSAGE),
  }),
  email: string()
    .when(['firstName', 'lastName'], {
      is: (firstName, lastName) => lastName || firstName,
      then: string().required(REQUIRED_MESSAGE),
    })
    .email('Please enter a valid email address'),
};

const fieldsSchema = object().shape({
  organizationMembers: array().of(
    object().shape(formSchema, [
      ['lastName', 'email'],
      ['firstName', 'email'],
      ['firstName', 'lastName'],
    ]),
  ),
});

const onSubmit = ({
  setError,
  setIsSaving,
  fieldsState,
  setFieldStateAtIndex,
  dispatch,
  history,
}) => ({ organizationMembers }) => {
  const filledFields = organizationMembers.filter(
    ({ firstName, lastName, email }) => firstName && lastName && email,
  );

  if (filledFields.length === 0) {
    setError(
      'organizationMembers',
      'manual',
      'You have to invite at least one person',
    );
    return;
  }

  setIsSaving(true);
  const invitationPromises = [];
  filledFields.forEach(person => {
    if (fieldsState[person.index]?.success) {
      return;
    }

    setFieldStateAtIndex(person.index, { loading: true });
    invitationPromises.push(
      invitePersonToOrganization(person)
        .then(response => {
          setFieldStateAtIndex(person.index, {
            loading: false,
            disabled: true,
            success: true,
          });
          return response;
        })
        .catch(error => {
          setFieldStateAtIndex(person.index, {
            loading: false,
            disabled: false,
            success: false,
          });
          setError(
            `organizationMembers[${person.index}].email`,
            'manual',
            error?.message || 'Something went wrong. Please try again later.',
          );
          throw new Error(error.message);
        }),
    );
  });

  Promise.all(invitationPromises)
    .then(() => {
      setIsSaving(false);
      history.push('/core/home/my-tasks');
      dispatch(
        openModal('OnboardingInviteConfirmation', {
          moreThanOneInvite: filledFields.length > 1,
        }),
      );
    })
    .catch(() => {
      setIsSaving(false);
    });
};

const OnboardingTeamSetupView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { orgUserRole } = useSelector(userProfileSelector);
  const firstTimeUser = localStorage.getItem('STORAGE_NEW_USER_FIRST_TIME');

  const [isSaving, setIsSaving] = useState(false);
  const [fieldsState, setFiledsState] = useState([]);
  const [
    lastFirstNameFieldReference,
    setLastFirstNameFieldReference,
  ] = useState(null);
  const firstFirstNameFieldReference = useRef(null);

  useEffect(() => {
    (async () => {
      const { baaSigned } = await checkBAASignedStatus()(dispatch);
      if (!baaSigned) {
        history.push('/onboarding/eula');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        { index: 0, firstName: '', lastName: '', email: '' },
        { index: 1, firstName: '', lastName: '', email: '' },
        { index: 2, firstName: '', lastName: '', email: '' },
      ],
    },
  });

  const { handleSubmit, control, register, errors, setError } = formMethods;

  const { fields, append } = useFieldArray({
    control,
    name: 'organizationMembers',
  });

  const setFieldStateAtIndex = useCallback((index, stateAtIndex) => {
    setFiledsState(state => {
      const stateToReturn = [...state];
      stateToReturn[index] = stateAtIndex;
      return stateToReturn;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ViewContainer>
      {firstTimeUser && (
        <>
          <OnboardingIndicator
            steps={orgUserRole === 'OWNER' ? 5 : 3}
            completedSteps={orgUserRole === 'OWNER' ? 5 : 3}
          />
          <Spacing vertical={5} />
        </>
      )}
      <Title>Bring your team together on Dock!</Title>
      <Description>
        Dock is designed specifically to help all your team members collaborate
        better on patient care. Just use this page to invite colleagues. You can
        add as many as you want.
      </Description>
      <Spacing vertical={5} />
      <FormContext {...formMethods}>
        <StyledForm
          onSubmit={handleSubmit(
            onSubmit({
              setError,
              setIsSaving,
              fieldsState,
              setFieldStateAtIndex,
              dispatch,
              history,
            }),
          )}
        >
          {errors?.organizationMembers?.message && (
            <FormErrorText>{errors.organizationMembers.message}</FormErrorText>
          )}
          {fields.map((item, index) => {
            const fieldState = fieldsState[item.index];

            return (
              <div key={item.index}>
                {index !== 0 && <Spacing vertical={5} />}

                <Grid
                  container
                  direction="row"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Grid item xs={3}>
                    <Input
                      inputRef={element => {
                        register(element);
                        if (!firstFirstNameFieldReference.current) {
                          firstFirstNameFieldReference.current = element;
                        }
                        if (index === fields.length - 1 && fields.length > 3) {
                          setLastFirstNameFieldReference(element);
                        }
                      }}
                      type="text"
                      name={`organizationMembers[${item.index}].firstName`}
                      label="First name"
                      required
                      disabled={fieldState?.disabled}
                      error={
                        errors?.organizationMembers?.[item.index]?.firstName
                          ?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Input
                      inputRef={register}
                      name={`organizationMembers[${item.index}].lastName`}
                      label="Last name"
                      required
                      disabled={fieldState?.disabled}
                      error={
                        errors?.organizationMembers?.[item.index]?.lastName
                          ?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={fieldState ? 5 : 6}>
                    <Input
                      inputRef={register}
                      type="text"
                      name={`organizationMembers[${item.index}].email`}
                      label="Email"
                      required
                      disabled={fieldState?.disabled}
                      error={
                        errors?.organizationMembers?.[item.index]?.email
                          ?.message
                      }
                    />
                  </Grid>
                  {fieldState && (
                    <Grid
                      container
                      item
                      xs={1}
                      justify={fieldState.loading ? 'center' : 'flex-start'}
                      style={{ alignSelf: 'center' }}
                    >
                      {fieldState.loading ? (
                        <Loader size={LoaderSizes.small} />
                      ) : (
                        renderSingleInviteLabel(fieldState.success)
                      )}
                    </Grid>
                  )}
                </Grid>
                <input
                  ref={register}
                  name={`organizationMembers[${item.index}].index`}
                  type="hidden"
                />
              </div>
            );
          })}
          <Spacing vertical={5} />
          <AddPersonButton
            type="button"
            onClick={() =>
              append({
                index: fields[fields.length - 1].index + 1,
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
              <Button fullWidth type="submit" disabled={isSaving}>
                Send invite
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                type="button"
                variant="text"
                onClick={() => history.push('/core/home/my-tasks')}
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
