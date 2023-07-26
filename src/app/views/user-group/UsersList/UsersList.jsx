import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@mui/material';
import { createFilter } from 'react-search-input';
import isEmpty from 'ramda/src/isEmpty';
import { capitalize } from 'helpers/capitalize';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import {
  StyledDataGrid,
  ListContainer,
  ListEntryContainer,
  UsersListContainer,
  PeopleCell,
} from './styled';

const renderColumnHeader = (props) => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
    </>
  );
};

const UsersList = (props) => {
  const { users, searchTerm } = props;
  const history = useHistory();

  const columns = [
    {
      field: 'name',
      headerName: 'USER',
      flex: 1,
      renderHeader: renderColumnHeader,
      renderCell: ({ row }) => {
        return (
          <PeopleCell
            className="people-cell-container"
            onClick={() =>
              history.push(
                `/core/assignedToPerson/${encodeURIComponent(
                  row.userIdentifier,
                )}`,
              )
            }
          >
            <UserAvatar size={22} user={row} />
            <Spacing horizontal={4} />
            <span className="people-cell">{row?.name}</span>
          </PeopleCell>
        );
      },
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      renderHeader: renderColumnHeader,
      flex: 1,
    },
    {
      field: 'orgUserRole',
      headerName: 'USER STATUS',
      renderHeader: renderColumnHeader,
      flex: 0.5,
      valueFormatter: ({ value }) => capitalize(value),
    },
  ];

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
              <RobotoTypography variant="h4">No users found</RobotoTypography>
            </Grid>
          </ListEntryContainer>
        </ListContainer>
      ) : (
        <StyledDataGrid
          columns={columns}
          rows={filteredUsers}
          rowHeight={35}
          headerHeight={45}
          hideFooterSelectedRowCount
          autoHeight
          disableSelectionOnClick
          disableColumnMenu
          showColumnRightBorder
          showCellRightBorder
        />
      )}
    </UsersListContainer>
  );
};

export default UsersList;
