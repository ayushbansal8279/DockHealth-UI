/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';

import { invitePersonToOrganization } from 'actions/people-actions';
import { inviteUserToTaskList } from 'actions/tasklist-actions';
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
  assignUser,
  refreshMembers,
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
        await inviteUserToTaskList(taskListIdentifier, response)(dispatch);

        await refreshMembers();

        setParentFormValue('assignedToIdentifier', response?.userIdentifier);
        await assignUser({
          value: response?.userIdentifier,
          displayLabel: response?.userName,
        });

        unsetInviting();
        closePopover();
      });
    },
    [
      closePopover,
      dispatch,
      setInviting,
      taskListIdentifier,
      unsetInviting,
      assignUser,
      refreshMembers,
      setParentFormValue,
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
