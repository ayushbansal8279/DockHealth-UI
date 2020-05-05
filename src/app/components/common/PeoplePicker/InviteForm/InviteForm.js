import React from 'react';
import { useFormContext, FormContext } from 'react-hook-form';
import Input from 'components/common/Input/Input';
import { invitePersonToTaskList } from 'actions/tasklist-actions';
import { invitePersonToOrganization } from 'actions/people-actions';
import { showAlert } from 'helpers/utility-functions';
import initializeInviteFormHooks from './hooks';
import { Container, Row, StyledButton } from './styled';

const InputWithContext = props => {
  const { register, errors } = useFormContext();
  const { name } = props;

  return <Input {...props} ref={register} error={errors?.[name]?.message} />;
};

const onSubmit = ({
  addInvitedPeople,
  addPerson,
  closeInviteForm,
  dispatch,
  openModal,
  taskListIdentifier,
}) => async ({ email, firstName, lastName }) => {
  let submitAction;

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
      openModal(userName);
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          error?.message ??
          'Invitation could not be sent, please try again later',
      });
    });
};

const InviteForm = ({
  addInvitedPeople,
  addPerson,
  closeInviteForm,
  initialValues,
  openModal,
  taskListIdentifier,
}) => {
  const { formContext, dispatch, handleSubmit } = initializeInviteFormHooks(
    initialValues,
  );

  return (
    <Container>
      <Row>
        <FormContext {...formContext}>
          <InputWithContext
            name="firstName"
            label="First name"
            styling="secondary"
          />
        </FormContext>

        <FormContext {...formContext}>
          <InputWithContext
            name="lastName"
            label="Last name"
            styling="secondary"
          />
        </FormContext>
      </Row>
      <Row>
        <FormContext {...formContext}>
          <InputWithContext
            name="email"
            label="Email address"
            styling="secondary"
            placeholder="Type the email address to invite"
            fullWidth
          />
        </FormContext>
      </Row>
      <Row>
        <StyledButton
          variant="contained"
          type="button"
          size="small"
          onClick={handleSubmit(
            onSubmit({
              addInvitedPeople,
              addPerson,
              closeInviteForm,
              dispatch,
              openModal,
              taskListIdentifier,
            }),
          )}
        >
          Invite
        </StyledButton>
      </Row>
    </Container>
  );
};

export default InviteForm;
