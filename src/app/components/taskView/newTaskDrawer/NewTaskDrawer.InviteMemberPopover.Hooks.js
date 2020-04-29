/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';

import { invitePersonToOrganization } from 'actions/people-actions';
import {
  getMembersByTaskListId,
  inviteUserToTaskList,
} from 'actions/tasklist-actions';
import useBoolean from 'hooks/useBoolean';

const REQUIRED_MESSAGE = 'This field is required';
const EMAIL_MESSAGE = 'This field requires a valid email address';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .email(EMAIL_MESSAGE)
    .required(REQUIRED_MESSAGE),
});

const initializeInviteMemberPopoverHooks = ({
  closePopover,
  initialValue,
  taskListIdentifier,
  isPopoverOpen,
  setParentFormValue,
}) => {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const [isInviting, setInviting, unsetInviting] = useBoolean(false);

  const dispatch = useDispatch();

  const { setValue } = formMethods;

  const onSubmit = useCallback(
    data => {
      setInviting();

      invitePersonToOrganization(data)(dispatch).then(async response => {
        await inviteUserToTaskList(
          taskListIdentifier,
          response?.userInviteIdentifier,
        )(dispatch);

        await getMembersByTaskListId(taskListIdentifier, 'ALL')(dispatch);

        setParentFormValue(
          'assignedToIdentifier',
          response?.userInviteIdentifier,
        );
        unsetInviting();
        closePopover();
      });
    },
    [
      closePopover,
      dispatch,
      setInviting,
      setParentFormValue,
      taskListIdentifier,
      unsetInviting,
    ],
  );

  useEffect(() => {
    if (isPopoverOpen) {
      const [firstName, ...otherNames] = initialValue.split(' ');

      // requestAnimationFrame is used in here due to form not being ready to accept values on first
      // component render
      requestAnimationFrame(() => {
        setValue('firstName', firstName);
        setValue('lastName', otherNames.join(' '));
      });
    }
  }, [initialValue, isPopoverOpen, setValue]);

  return {
    formMethods,
    onSubmit,
    isInviting,
  };
};

export default initializeInviteMemberPopoverHooks;
