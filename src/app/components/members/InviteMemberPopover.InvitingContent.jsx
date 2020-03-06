import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import {
  invitePersonToTaskList,
  getMembersByTaskListId,
} from '../../actions/tasklist-actions';
import { showAlert } from '../../helpers/utility-functions';
import { UniversalStyledInput } from '../userProfileView/UniversalStyledInput';
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
          error.errorMessage ??
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
        <span>Invite a person</span>
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
            <UniversalStyledInput
              label="First Name"
              name="firstName"
              required
            />
            <UniversalStyledInput label="Last Name" name="lastName" required />
            <UniversalStyledInput label="Email" name="email" required />
          </FormSection>
          <PopoverDivider />
          <PopoverBottomSection>
            <Button type="submit" variant="contained" fullWidth>
              Send invite
            </Button>
          </PopoverBottomSection>
        </FormContext>
      </form>
    </>
  );
};

export default InvitingContent;
