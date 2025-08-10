import React from 'react';
import { Box } from '@mui/material';
import {
  ModalHeader,
  ModalDescription,
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
} from '../styled';
import ProfileList from '@/app/components/custom-profile/CustomProfilesList/ProfileList';
import { ProfileListWrapper } from './styled';
import { useDispatch } from 'react-redux';
import { mergeProfile } from '@/app/actions/profile-actions';
import { createProfileListPath } from '@/app/routing/helpers/paths';
import { useHistory } from 'react-router-dom';
import { openModal } from 'modal/actions';

const ProfilePickerModal = ({
  closeModal,
  profileTypeIdentifier,
  profile
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSelect = (currentProfile, selectedProfile) => {
    dispatch(
      openModal('MergeData', {
        to: selectedProfile.displayName,
        from: currentProfile.displayName,
        type: "profile",
        confirm: () => {
          dispatch(closeModal);
          dispatch(
            mergeProfile(currentProfile.identifier, selectedProfile.identifier, () => {
              history.push(
                createProfileListPath(profileTypeIdentifier, selectedProfile.identifier)
              )
            })
          );
        },
      }),
    );
  }

  return (
    <ModalWrapperWithPadding width="auto">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Select object</ModalHeader>
      <ModalDescription>Select Object to Merge To</ModalDescription>
      <Box my={1} />
      <ProfileListWrapper>
        <ProfileList
          profileTypeIdentifier={profileTypeIdentifier}
          profile={profile}
          onSelect={handleSelect}
        />
      </ProfileListWrapper>
      <Box my={2} />
    </ModalWrapperWithPadding>
  );
};

export default ProfilePickerModal;
