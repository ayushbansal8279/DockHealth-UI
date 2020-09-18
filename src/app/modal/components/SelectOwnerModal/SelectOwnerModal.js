import React, { useState } from 'react';
import { isEmpty } from 'ramda';
import { hashHistory } from 'react-router';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member/Member';
import SearchIcon from 'img/black-search-icon.svg';
import folderUser from 'img/modals/user-folder';
import { changeUserToOwner } from 'api/people-api';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
} from '../styled';
import {
  UsersContainer,
  UsersList,
  UserItem,
  UserName,
  SearchUserInputContainer,
  SearchUserInput,
  UserNotFound,
} from './styled';

const SelectOwnerModal = ({
  closeModal,
  confirm,
  currentActiveUsers,
  isRemovingFlow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState({});

  const currentActiveUsersWithMemberRole = currentActiveUsers?.filter(
    user =>
      user?.orgUserRole === 'MEMBER' &&
      user?.userStatus === 'ACTIVE' &&
      user?.eulaAcknowledged === true,
  );

  const searchedUsers = currentActiveUsersWithMemberRole?.filter(
    ({ firstName, lastName }) =>
      firstName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      lastName?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <Typography color="textPrimary" variant="h2">
            SELECTING AN OWNER
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            At this time, you don’t have any organizational owners. You must
            have one person assigned as an owner. Who would you like to assign
            as the organizational owner?
          </Typography>
        </ModalDescriptionContainer>
        <UsersContainer>
          <SearchUserInputContainer>
            <SearchUserInput
              onChange={event => setSearchQuery(event.target.value)}
            />
            <img src={SearchIcon} alt="Search icon" />
          </SearchUserInputContainer>
          <UsersList>
            {searchedUsers?.length === 0 && (
              <UserNotFound>No user found</UserNotFound>
            )}
            {searchedUsers?.map(user => (
              <UserItem
                onClick={() =>
                  selectedUser?.userIdentifier === user?.userIdentifier
                    ? setSelectedUser({})
                    : setSelectedUser(user)
                }
                isSelected={
                  selectedUser?.userIdentifier === user?.userIdentifier
                }
              >
                <Member member={user} size={33} />
                <UserName>
                  {user?.firstName} {user?.lastName}
                </UserName>
              </UserItem>
            ))}
          </UsersList>
        </UsersContainer>
        <ButtonsContainer>
          <Button
            fullWidth
            variant="outlined"
            type="button"
            color="red"
            size="small"
            onClick={closeModal}
          >
            CANCEL
          </Button>
          <Spacing horizontal={4} />
          <Button
            fullWidth
            variant="contained"
            type="button"
            size="small"
            color="red"
            disabled={isEmpty(selectedUser)}
            onClick={() => {
              changeUserToOwner(selectedUser?.userIdentifier).then(() => {
                confirm();
                closeModal();
                if (isRemovingFlow) {
                  hashHistory.replace('/logout');
                } else {
                  hashHistory.push('/home/my-tasks');
                }
              });
            }}
          >
            ASSIGN AS OWNER
          </Button>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default SelectOwnerModal;
