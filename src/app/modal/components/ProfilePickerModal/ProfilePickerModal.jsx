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

const ProfilePickerModal = ({
  closeModal,
  profileTypeIdentifier,
  profile,
  onSelect,
}) => {
  return (
    <ModalWrapperWithPadding width="auto">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Select profile</ModalHeader>
      <ModalDescription>Select Profile to Merge To</ModalDescription>
      <Box my={1} />
      <ProfileListWrapper>
        <ProfileList 
          profileTypeIdentifier={profileTypeIdentifier} 
          profile={profile}
          onSelect={onSelect}
        />
      </ProfileListWrapper>
      <Box my={2} />
    </ModalWrapperWithPadding>
  );
};

export default ProfilePickerModal;
