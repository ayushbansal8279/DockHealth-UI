import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import InviteMemberToListForm from 'components/members/InviteMemberToListForm/InviteMemberToListForm';
import { InviteToListModalWrapper, Header, Title, Description } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const InviteToListModal = ({ closeModal, list = null }) => {
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
          <Description>
            Invite as many people as you’d like to share it with. The people you
            invite to this list will have access to the tasks, people and
            patients who are part of this list.
          </Description>
        </Header>
        <InviteMemberToListForm list={list} />
      </Grid>
    </InviteToListModalWrapper>
  );
};

export default InviteToListModal;
