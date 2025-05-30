import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as TaskListApi from 'api/task-list-api';
import { showAlert } from 'helpers/utility-functions';
import { userProfileSelector } from 'selectors/user-selectors';
import OrganizationOwnerForm from './OrganizationOwnerForm/OrganizationOwnerForm';
import MemberForm from './MemberForm/MemberForm';
import { ExternalInviteContainer } from './styled';

const ExternalInviteForm = ({
  closeInviteForm,
  initialValues,
  onInviteSuccess,
  taskListIdentifier,
  customInviteMethod
}) => {
  const [isInviting, setIsInviting] = useState(false);

  const currentUser = useSelector(userProfileSelector);

  const isOrganizationAdmin = ['ADMIN', 'OWNER'].includes(
    currentUser.orgUserRole,
  );

  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        event.preventDefault();
        event.stopPropagation();

        closeInviteForm();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = useCallback(
    (data) => {
      setIsInviting(true);

      const submitPromise = customInviteMethod
        ? customInviteMethod(data)
        : TaskListApi.invitePersonToTaskList(taskListIdentifier, data);

      submitPromise
        .then(() => {
          setIsInviting(false);
          onInviteSuccess();
          closeInviteForm();
        })
        .catch((error) => {
          setIsInviting(false);
          showAlert({
            status: 'error',
            title: 'Error',
            text: error?.response?.data?.errorMessage ?? error?.message,
          });
        });
    },
    [taskListIdentifier, onInviteSuccess, closeInviteForm, customInviteMethod],
  );

  return (
    <ExternalInviteContainer>
      <OrganizationOwnerForm
        isOrganizationAdmin={isOrganizationAdmin}
        initialValues={initialValues}
        closeInviteForm={closeInviteForm}
        onSubmit={handleSubmitForm}
        disabled={isInviting}
      />
    </ExternalInviteContainer>
  );
};

export default ExternalInviteForm;
