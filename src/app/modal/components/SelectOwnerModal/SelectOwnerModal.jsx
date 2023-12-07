import React, { useState } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import SearchIcon from 'img/black-search-icon.svg';
import folderUser from 'img/modals/user-folder.png';
import { changeUserToOwner } from 'api/organization-api';
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
  const history = useHistory();

  const currentActiveUsersWithMemberRole = currentActiveUsers?.filter(
    (user) =>
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
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <img src={SearchIcon} alt="Search icon" />
          </SearchUserInputContainer>
          <UsersList>
            {searchedUsers?.length === 0 && (
              <UserNotFound>No user found</UserNotFound>
            )}
            {searchedUsers?.map((user) => (
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
                <UserAvatar user={user} size={35} />
                <UserName>
                  {user?.firstName} {user?.lastName}$
                  {user?.credentials ? `, ${user?.credentials}` : ''}
                </UserName>
              </UserItem>
            ))}
          </UsersList>
        </UsersContainer>
        <ButtonsContainer>
          <Button
            fullWidth
            variant="secondary-red"
            size="small"
            onClick={closeModal}
          >
            CANCEL
          </Button>
          <Spacing horizontal={4} />
          <Button
            fullWidth
            variant="primary-red"
            size="small"
            disabled={isEmpty(selectedUser)}
            onClick={() => {
              changeUserToOwner(selectedUser?.userIdentifier).then(() => {
                confirm();
                closeModal();
                if (isRemovingFlow) {
                  history.replace('/auth/logout');
                } else {
                  history.push('/core/home/my-tasks');
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
