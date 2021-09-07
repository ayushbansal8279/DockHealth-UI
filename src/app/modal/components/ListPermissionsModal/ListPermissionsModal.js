import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import GrantMemberPermissionsListForm from 'components/members/GrantMemberPermissionsListForm/GrantMemberPermissionsListForm';
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
            Invite people you’d like to share it with. The people you invite to
            will be able to view and use the workflow. In addition, you can
            assign some of those people editor privileges.
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
