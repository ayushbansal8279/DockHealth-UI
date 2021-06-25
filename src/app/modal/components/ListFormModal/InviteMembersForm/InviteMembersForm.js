/* eslint-disable import/extensions */
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import PersonIcon from 'img/modals/person';
import PeopleIcon from 'img/modals/people';
import Spacing from 'components/common/Spacing';
import InviteMemberToListForm from 'components/members/InviteMemberToListForm/InviteMemberToListForm';
import { useDispatch } from 'react-redux';
import { getMembersByTaskListId } from '../../../../actions/task-list-actions';
import { Title, Header, Description } from '../styled';

import {
  InviteInitialViewWrapper,
  InviteInitialViewContent,
  NavigationActionButton,
  NavigationIcon,
  NavigationText,
  SkipButton,
  Wrapper,
} from './styled';

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
  const [newListView, setNewListView] = useState(!isListEditMode);
  if (newListView) {
    return (
      <InviteInitialViewWrapper>
        <Header>
          <Title>Would you like to Invite people to this list?</Title>
        </Header>
        <InviteInitialViewContent>
          <NavigationActionButton onClick={closeModal}>
            <Spacing vertical={5} />
            <NavigationIcon src={PersonIcon} alt="Just for me" />
            <Spacing vertical={5} />
            <NavigationText>This list is just for me</NavigationText>
          </NavigationActionButton>
          <NavigationActionButton onClick={() => setNewListView(false)}>
            <Spacing vertical={5} />
            <NavigationIcon src={PeopleIcon} alt="Invite others" />
            <Spacing vertical={5} />
            <NavigationText>Invite others to this list</NavigationText>
          </NavigationActionButton>
        </InviteInitialViewContent>
      </InviteInitialViewWrapper>
    );
  }

  return (
    <Wrapper>
      <Grid container direction="column" justify="space-between" wrap="nowrap">
        <Grid container direction="column" item wrap="nowrap">
          <Header>
            <Title>Invite Others to this list</Title>
            <Description>
              Invite as many people as you’d like to share it with. The people
              you invite to this list will have access to the tasks, people and
              patients who are part of this list.
            </Description>
          </Header>
          <InviteMemberToListForm
            list={list}
            externalInvitePosition={{ bottom: -60 }}
            onMembersRefresh={getListMembers}
          />
        </Grid>
        <Spacing vertical={4} />
        <SkipButton type="button" onClick={closeModal}>
          Continue
        </SkipButton>
      </Grid>
    </Wrapper>
  );
};

export default InviteMembersForm;
