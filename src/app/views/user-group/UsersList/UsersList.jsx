import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@mui/material';
import { createFilter } from 'react-search-input';
import isEmpty from 'ramda/src/isEmpty';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import {
  ListContainer,
  ListEntryContainer,
  UsersListContainer,
} from './styled';

// const renderColumnHeader = (props) => {
//   const { colDef } = props;
//   const { headerName } = colDef;

//   return (
//     <>
//       <div className="MuiDataGrid-colCellTitle">
//         <span>{headerName}</span>
//       </div>
//     </>
//   );
// };

const UsersList = (props) => {
  const { users, searchTerm } = props;
  const history = useHistory();

  // const columns = [
  //   {
  //     field: 'name',
  //     headerName: 'USER',
  //     renderHeader: renderColumnHeader,
  //     renderCell: ({ row }) => {
  //       return (
  //         <div
  //           className="people-cell-container"
  //           style={{ display: 'flex' }}
  //           onClick={() =>
  //             history.push(
  //               `/core/assignedToPerson/${encodeURIComponent(
  //                 row.userIdentifier,
  //               )}`,
  //             )
  //           }
  //         >
  //           <UserAvatar size={22} user={row} />
  //           <Spacing horizontal={4} />
  //           <span className="people-cell">{row?.name}</span>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     field: 'email',
  //     headerName: 'EMAIL',
  //     renderHeader: renderColumnHeader,
  //     flex: 1,
  //   },
  //   {
  //     field: 'orgUserRole',
  //     headerName: 'USER STATUS',
  //     renderHeader: renderColumnHeader,
  //     flex: 0.5,
  //     valueFormatter: ({ value }) => capitalize(value),
  //   },
  // ];

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
        // <StyledDataGrid
        //   columns={columns}
        //   rows={filteredUsers}
        // rowHeight={35}
        // headerHeight={45}
        // hideFooterSelectedRowCount
        // autoHeight
        //   disableSelectionOnClick
        //   disableColumnMenu
        //   showColumnRightBorder
        //   showCellRightBorder
        // />
        <DataGrid
          dataset={filteredUsers}
          hideFooterSelectedRowCount
          autoHeight
          fluid
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
