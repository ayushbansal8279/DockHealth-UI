import { ProfileStatus } from 'helpers/profile-helpers';
import { archiveProfile, deleteProfile } from 'api/profile-api';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { closeModal, openModal } from 'modal/actions';

export const createProfileMenuOptions = ({
  dispatch,
  history,
  profile,
  profileTypeIdentifier,
  setEditMode,
  onClose,
}) => {
  const openArchiveModal = (
    title,
    nextStatus,
    confirmText,
    successMessage,
  ) => {
    dispatch(
      openModal('DeleteConfirmation', {
        title,
        description: `Are you sure you want to ${confirmText.toLowerCase()} this object?`,
        confirm: () => {
          archiveProfile(profile?.identifier, nextStatus).then(() => {
            dispatch(showGlobalAlert(successMessage));
            history.push(`/custom-objects/${profileTypeIdentifier}`);
          });
          dispatch(closeModal());
        },
        confirmButtonText: confirmText,
      }),
    );
  };

  return [
    { name: 'Edit', onClick: () => setEditMode(true) },
    {
      name: 'Merge',
      onClick: () => {
        dispatch(
          openModal('ProfilePicker', {
            profileTypeIdentifier: profileTypeIdentifier,
            profile: profile,
          }),
        );
        onClose();
      },
    },
    ...(profile?.profileStatus === ProfileStatus.ACTIVE
      ? [
          {
            name: 'Archive',
            onClick: () =>
              openArchiveModal(
                'Archive Object',
                ProfileStatus.ARCHIVED,
                'Archive',
                AlertMessages.ARCHIVED,
              ),
          },
        ]
      : profile?.profileStatus === ProfileStatus.ARCHIVED
      ? [
          {
            name: 'Restore',
            onClick: () =>
              openArchiveModal(
                'Restore Object',
                ProfileStatus.ACTIVE,
                'Restore',
                AlertMessages.UNARCHIVED,
              ),
          },
        ]
      : []),
    {
      name: 'Delete',
      onClick: () => {
        dispatch(
          openModal('DeleteConfirmation', {
            description: 'Are you sure to delete this object?',
            confirm: () => {
              deleteProfile(profile?.identifier).then(() => {
                dispatch(showGlobalAlert(AlertMessages.DELETED));
                history.push(`/custom-objects/${profileTypeIdentifier}`);
              });
              dispatch(closeModal());
            },
          }),
        );
      },
    },
  ];
};

