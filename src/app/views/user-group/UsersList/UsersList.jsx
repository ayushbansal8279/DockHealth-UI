import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@mui/material';
import { createFilter } from 'react-search-input';
import isEmpty from 'ramda/src/isEmpty';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme';
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import {
  ListContainer,
  ListEntryContainer,
  UsersListContainer,
} from './styled';

const UsersList = (props) => {
  const { users, searchTerm } = props;
  const history = useHistory();

  const KEYS_TO_FILTERS = [
    'name',
    'email',
    'homePhoneNumber',
    'faxNumber',
    'workPhoneNumber',
  ];

  const usersWithId = users.map((user) => ({
    id: user?.userIdentifier,
    ...user,
  }));

  const filteredUsers = searchTerm
    ? usersWithId?.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) ?? []
    : usersWithId;

  return (
    <UsersListContainer>
      {isEmpty(filteredUsers) ? (
        <ListContainer>
          <ListEntryContainer>
            <Grid container justifyContent="center" alignItems="center">
              <OutfitTypography variant="h4">No users found</OutfitTypography>
            </Grid>
          </ListEntryContainer>
        </ListContainer>
      ) : (
        <DataGrid
          fluid
          dataset={filteredUsers}
          hideFooterSelectedRowCount
          autoHeight
        >
          <Data
            name="USER"
            value={(data) => (
              <div
                className="people-cell-container"
                style={{ display: 'flex' }}
                onClick={() =>
                  history.push(
                    `/core/assignedToPerson/${encodeURIComponent(
                      data.userIdentifier,
                    )}`,
                  )
                }
              >
                <UserAvatar size={22} user={data} />
                <Spacing horizontal={4} />
                <span className="people-cell">{data?.name}</span>
              </div>
            )}
          />
          <Data name="EMAIL" value={(data) => data.email} />
          <Data
            name="USER STATUS"
            value={(data) => data.orgUserRole}
            flex={0.5}
          />
        </DataGrid>
      )}
    </UsersListContainer>
  );
};

export default UsersList;
