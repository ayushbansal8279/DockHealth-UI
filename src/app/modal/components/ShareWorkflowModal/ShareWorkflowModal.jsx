import React, { useCallback, useState } from 'react';
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
  const { closeModal, confirm } = props;

  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  const handleConfirm = useCallback(() => {

    const orgIdentifiers = selectedOrganizations.map((o) => o.organizationIdentifier);

    const responseData = {
      organizations: orgIdentifiers,
    };

    if (typeof confirm === 'function') {
      confirm(responseData);
      closeModal();
    } else {
      console.warn('You have to provide confirm callback');
    }
  }, [selectedOrganizations, confirm, closeModal]);

  const selectOrganization = (organization) => {
    if (organization) {
      setSelectedOrganizations((o) => [...o, organization]);
    }
  };

  const unselectOrganization = (orgId) => {
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
          onAdd={selectOrganization}
          onDelete={unselectOrganization}
        />
        <Spacing vertical={6} />
        <ButtonWrapper>
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <ConfirmButton onClick={handleConfirm}>Share</ConfirmButton>
        </ButtonWrapper>
      </Grid>
    </InviteToListModalWrapper>
  );
};

export default ShareWorkflowModal;
