import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import InviteUserOrGroupToListForm from 'components/user/InviteMemberToListForm/InviteUserOrGroupToListForm';
import {
  InviteToListModalWrapper,
  Header,
  Title,
  ButtonWrapper,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import { CancelButton, ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';

const InviteToListModal = ({ closeModal, onMembersRefresh, list = null }) => {
  useEffect(() => {
    if (!list) {
      closeModal();
    }
  }, [closeModal, list]);

  return (
    <InviteToListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Grid container direction="column" item wrap="nowrap">
        <Header>
          <Title>Invite Others to this list</Title>
        </Header>
        <InviteUserOrGroupToListForm
          list={list}
          onMembersRefresh={onMembersRefresh}
        />
        <Spacing vertical={4} />
        <ButtonWrapper>
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <ConfirmButton onClick={closeModal}>Save</ConfirmButton>
        </ButtonWrapper>
      </Grid>
    </InviteToListModalWrapper>
  );
};

export default InviteToListModal;
