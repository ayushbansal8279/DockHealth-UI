import { Button } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import {
  getMembersByTaskListId,
  invitePersonToTaskList,
} from 'actions/tasklist-actions';
import { showAlert } from 'helpers/utility-functions';
import { MontserratTypography } from 'styles/theme-montserrat';
import { UniversalMontserratInput } from '../common/UniversalInput/UniversalInput';
import {
  FormSection,
  PopoverBottomSection,
  PopoverDivider,
  PopoverHeader,
  PopoverHeaderCloseButton,
} from './InviteMemberPopover.Styled';

const REQUIRED_MESSAGE = 'This field is required';
const EMAIL_MESSAGE = 'This field requires valid email address';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email(EMAIL_MESSAGE),
});

const onSubmit = ({ dispatch, unsetInviting, taskListIdentifier }) => async ({
  email,
  firstName,
  lastName,
}) => {
  invitePersonToTaskList(
    {
      email,
      firstName,
      lastName,
    },
    taskListIdentifier,
  )(dispatch)
    .then(() => {
      getMembersByTaskListId(taskListIdentifier, 'ALL')(dispatch);
      unsetInviting();
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

const InvitingContent = ({ unsetInviting, taskList }) => {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const dispatch = useDispatch();

  return (
    <>
      <PopoverHeader>
        <PopoverHeaderCloseButton onClick={unsetInviting}>
          <BackIcon />
        </PopoverHeaderCloseButton>
        <MontserratTypography variant="h4">
          Invite a person
        </MontserratTypography>
      </PopoverHeader>
      <form
        onSubmit={formMethods.handleSubmit(
          onSubmit({
            dispatch,
            unsetInviting,
            taskListIdentifier: taskList.taskListIdentifier,
          }),
        )}
        autoComplete="off"
        autoCorrect="off"
      >
        <FormContext {...formMethods}>
          <FormSection>
            <UniversalMontserratInput
              label="First Name"
              name="firstName"
              required
            />
            <UniversalMontserratInput
              label="Last Name"
              name="lastName"
              required
            />
            <UniversalMontserratInput label="Email" name="email" required />
          </FormSection>
          <PopoverDivider />
          <PopoverBottomSection>
            <Button type="submit" variant="contained" fullWidth size="small">
              Send invite
            </Button>
          </PopoverBottomSection>
        </FormContext>
      </form>
    </>
  );
};

export default InvitingContent;
