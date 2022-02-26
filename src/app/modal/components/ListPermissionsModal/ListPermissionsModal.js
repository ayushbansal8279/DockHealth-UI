import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import GrantMemberPermissionsListForm from 'components/user/GrantMemberPermissionsListForm/GrantMemberPermissionsListForm';
import { InviteToListModalWrapper, Header, Title, Description } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const ListPermissionsModal = ({
  closeModal,
  onMembersRefresh,
  list = null,
}) => {
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
          <Title>WORKFLOW PERMISSIONS</Title>
          <Description>
            Invite people you’d like to share this with. The people you invite
            will be able to view and use the workflow. In addition, you can give
            editor privileges to invited users.
          </Description>
        </Header>
        <GrantMemberPermissionsListForm
          list={list}
          onMembersRefresh={onMembersRefresh}
        />
      </Grid>
    </InviteToListModalWrapper>
  );
};

export default ListPermissionsModal;
