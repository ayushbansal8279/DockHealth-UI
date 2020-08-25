import React, { useRef, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import Input from 'components/common/Input/Input';
import { invitePersonToTaskList } from 'actions/tasklist-actions';
import { invitePersonToOrganization } from 'actions/people-actions';
import { showAlert } from 'helpers/utility-functions';
import Button from 'components/common/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { object, string } from 'yup';
import { FormWrapper } from './styled';

const REQUIRED_FIELD = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_FIELD),
  lastName: string().required(REQUIRED_FIELD),
  email: string()
    .required(REQUIRED_FIELD)
    .email('Please enter a valid email address'),
});

const onSubmit = ({
  addInvitedPeople,
  addPerson,
  closeInviteForm,
  dispatch,
  onInviteSuccess,
  taskListIdentifier,
}) => ({ email, firstName, lastName }) => {
  let submitAction;
  debugger;

  // TODO: refactor submit
  if (taskListIdentifier) {
    submitAction = () =>
      invitePersonToTaskList(
        {
          email,
          firstName,
          lastName,
        },
        taskListIdentifier,
        false,
      )(dispatch);
  } else {
    submitAction = () =>
      invitePersonToOrganization({
        email,
        firstName,
        lastName,
      })(dispatch);
  }

  submitAction()
    .then(data => {
      const { userId, userName } = data;
      addInvitedPeople(userName);
      addPerson({ userIdentifier: userId });
      closeInviteForm();
      onInviteSuccess(userName);
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.response?.data?.errorMessage ?? error?.message,
      });
    });
};

const ExternalInviteForm = ({
  addInvitedPeople,
  addPerson,
  closeInviteForm,
  initialValues,
  onInviteSuccess,
  taskListIdentifier,
}) => {
  const emailInputReference = useRef(null);
  const dispatch = useDispatch();
  const formContext = useForm({
    validationSchema,
    defaultValues: initialValues,
  });

  const { handleSubmit, register, errors } = formContext;

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  useEffect(() => {
    if (emailInputReference.current) {
      emailInputReference.current.focus();
    }
  }, [emailInputReference]);

  return (
    <FormWrapper
      onSubmit={handleSubmit(
        onSubmit({
          addInvitedPeople,
          addPerson,
          closeInviteForm,
          dispatch,
          onInviteSuccess,
          taskListIdentifier,
        }),
      )}
    >
      <FormContext {...formContext}>
        <Grid container direction="column" spacing={2}>
          <Grid
            container
            item
            direction="row"
            alignItems="flex-end"
            spacing={2}
          >
            <Grid item xs={6}>
              <Input
                ref={register}
                name="firstName"
                label="First name"
                styling="secondary"
                showError
                required
                error={errors?.firstName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                ref={register}
                name="lastName"
                label="Last name"
                styling="secondary"
                showError
                required
                error={errors?.lastName?.message}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Input
              ref={element => {
                register(element);
                emailInputReference.current = element;
              }}
              name="email"
              label="Email address"
              styling="secondary"
              placeholder="Type the email address to invite"
              fullWidth
              showError
              required
              error={errors?.email?.message}
            />
          </Grid>
          <Grid item>
            <Button fullWidth variant="contained" type="submit" size="small">
              Invite
            </Button>
          </Grid>
        </Grid>
      </FormContext>
    </FormWrapper>
  );
};

export default ExternalInviteForm;
