/* eslint-disable import/extensions */
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import InviteUserOrGroupToListForm from 'components/user/InviteMemberToListForm/InviteUserOrGroupToListForm';
import { useDispatch } from 'react-redux';
import { getMembersByTaskListId } from 'actions/task-list-actions';
import { Title, Header } from '../styled';
import {
  Wrapper,
  ButtonWrapper,
} from './styled';
import { CancelButton, ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';

const InviteMembersForm = ({
  closeModal,
  isListEditMode,
  list,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const getListMembers = () => {
    const { taskListIdentifier } = list;
    dispatch(getMembersByTaskListId(taskListIdentifier, 'ALL'));
  };

  return (
    <Wrapper>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Grid container direction="column" item wrap="nowrap">
          <Header>
            <Title>Share List</Title>
          </Header>
          <InviteUserOrGroupToListForm
            list={list}
            externalInvitePosition={{ bottom: -60 }}
            onMembersRefresh={getListMembers}
          />
        </Grid>
        <Spacing vertical={4} />
        <ButtonWrapper>
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <ConfirmButton onClick={closeModal}>Save</ConfirmButton>
        </ButtonWrapper>
      </Grid>
    </Wrapper>
  );
};

export default InviteMembersForm;
