import React from 'react';
import { useFormContext, FormContext } from 'react-hook-form';
import Input from 'components/common/Input/Input';
import { invitePersonToTaskList } from 'actions/tasklist-actions';
import { invitePersonToOrganization } from 'actions/people-actions';
import { showAlert } from 'helpers/utility-functions';
import initializeInviteFormHooks from './hooks';
import { Container, Row, StyledButton } from './styled';
import messages from '../messages';

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
  onInviteSuccess,
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
      onInviteSuccess(userName);
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          error?.message ??
          messages.inviteForm.submit.error,
      });
    });
};

const InviteForm = ({
  addInvitedPeople,
  addPerson,
  closeInviteForm,
  initialValues,
  onInviteSuccess,
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
            label={messages.inviteForm.firstName.label}
            styling="secondary"
            showError
            required
          />
        </FormContext>

        <FormContext {...formContext}>
          <InputWithContext
            name="lastName"
            label={messages.inviteForm.lastName.label}
            styling="secondary"
            showError
            required
          />
        </FormContext>
      </Row>
      <Row>
        <FormContext {...formContext}>
          <InputWithContext
            name="email"
            label={messages.inviteForm.email.label}
            styling="secondary"
            placeholder={messages.inviteForm.email.placeholder}
            fullWidth
            showError
            required
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
              onInviteSuccess,
              taskListIdentifier,
            }),
          )}
        >
          {messages.inviteForm.invite}
        </StyledButton>
      </Row>
    </Container>
  );
};

export default InviteForm;
