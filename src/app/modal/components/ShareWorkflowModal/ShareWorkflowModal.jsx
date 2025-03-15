import React, { useEffect, useState } from 'react';
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
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import OrganizationsSelect from './OrganizationsSelect/OrganizationsSelect';

const ShareWorkflowModal = (props) => {
  const { closeModal } = props;
  // useEffect(() => {
  //   if (!list) {
  //     closeModal();
  //   }
  // }, [closeModal, list]);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const addSelectedOrganization = (organization) => {
    if (organization) {
      setSelectedOrganizations((o) => [...o, organization]);
    }
  };

  const deleteSelectedOrganization = (orgId) => {
    setSelectedOrganizations((previousSelectedOrganizations) =>
      previousSelectedOrganizations?.filter(
        (se) => se?.organizationIdentifier !== orgId,
      ),
    );
  };

  return (
    <InviteToListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Grid container direction="column" item wrap="nowrap">
        <Header>
          <Title>Share Workflow</Title>
        </Header>
        {/* <InviteUserOrGroupToListForm
          list={list}
          onMembersRefresh={onMembersRefresh}
        /> */}
        <OrganizationsSelect
          selectedOrganizations={selectedOrganizations}
          onAdd={addSelectedOrganization}
          onDelete={deleteSelectedOrganization}
          // onMoveToExternalUserForm={handleMoveToExternalForm}
        />
        <Spacing vertical={6} />
        <ButtonWrapper>
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <ConfirmButton onClick={closeModal}>Share</ConfirmButton>
        </ButtonWrapper>
      </Grid>
    </InviteToListModalWrapper>
  );
};

export default ShareWorkflowModal;
