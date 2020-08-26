import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import * as TaskListApi from 'api/tasklist-api';
import { showAlert } from 'helpers/utility-functions';
import OrganizationOwnerForm from './OrganizationOwnerForm/OrganizationOwnerForm';
import MemberForm from './MemberForm/MemberForm';
import { ExternalInviteContainer } from './styled';

const ExternalInviteForm = ({
  closeInviteForm,
  initialValues,
  onInviteSuccess,
  taskListIdentifier,
}) => {
  const [isInviting, setIsInviting] = useState(false);

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  const isOrganizationAdmin = ['ADMIN', 'OWNER'].includes(
    currentUser.orgUserRole,
  );

  const handleSubmitForm = useCallback(
    data => {
      setIsInviting(true);

      TaskListApi.invitePersonToTaskList(taskListIdentifier, data)
        .then(() => {
          setIsInviting(false);
          onInviteSuccess();
          closeInviteForm();
        })
        .catch(error => {
          setIsInviting(false);
          showAlert({
            status: 'error',
            title: 'Error',
            text: error?.response?.data?.errorMessage ?? error?.message,
          });
        });
    },
    [taskListIdentifier, onInviteSuccess, closeInviteForm],
  );

  return (
    <ExternalInviteContainer>
      {isOrganizationAdmin ? (
        <OrganizationOwnerForm
          initialValues={initialValues}
          closeInviteForm={closeInviteForm}
          onSubmit={handleSubmitForm}
        />
      ) : (
        <MemberForm
          initialValues={initialValues}
          closeInviteForm={closeInviteForm}
          onSubmit={handleSubmitForm}
          disabled={isInviting}
        />
      )}
    </ExternalInviteContainer>
  );
};

export default ExternalInviteForm;
