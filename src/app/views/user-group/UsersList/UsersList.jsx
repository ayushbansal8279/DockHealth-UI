import React, { useContext, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@mui/material';
import { createFilter } from 'react-search-input';
import isEmpty from 'ramda/src/isEmpty';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme';
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import {
  BulkContainer,
  ListContainer,
  ListEntryContainer,
  UsersListContainer,
} from './styled';
import TaskItemBulkEdit from '@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit';
import Checkbox from '@/app/components/common/Checkbox/Checkbox';
import { UserEditContext } from '@/app/context-api/user-edit-context';
import ReusableDataGrid from '@/app/components/custom-profile/CustomProfilesList/DataGrid/DataGrid';

const UsersList = (props) => {
  const { users, searchTerm } = props;
  const history = useHistory();

  const userContext = useContext(UserEditContext);
  const {
    selectableUsers,
    setSelectableUsers,
    isListChecked,
    toggleUser,
    toggleAllUser,
  } = userContext;

  const KEYS_TO_FILTERS = [
    'name',
    'email',
    'homePhoneNumber',
    'faxNumber',
    'workPhoneNumber',
  ];

  const usersWithId = useMemo(() => {
    return users.map((user) => ({
      id: user?.userIdentifier,
      isSelected: false,
      ...user,
    }));
  }, [users]);

  const filteredUsers = useMemo(
    () =>
      searchTerm
        ? usersWithId?.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) ?? []
        : usersWithId,
    [usersWithId, searchTerm],
  );

  useEffect(() => {
    setSelectableUsers(filteredUsers);
  }, [filteredUsers]);

  const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }) => (
    <BulkContainer>
      <Checkbox isChecked={isListChecked} onClick={onListSelect} />
    </BulkContainer>
  );

  const columns = [
    {
      field: 'isSelected',
      headerName: '',
      flex: 0.1,
      sortable: false,
      renderHeader: () =>
        renderCheckboxColumnHeader({
          isListChecked,
          onListSelect: toggleAllUser,
        }),
      renderCell: (params) => (
        <TaskItemBulkEdit
          isChecked={params.row.isSelected}
          onClick={() => toggleUser(params.row.id)}
        />
      ),
    },
    {
      field: 'user',
      headerName: 'USER',
      flex: 1,
      renderCell: (params) => (
        <div
          className="people-cell-container"
          style={{ display: 'flex' }}
          onClick={() =>
            history.push(
              `/core/assignedToPerson/${encodeURIComponent(
                params.row.userIdentifier,
              )}`,
            )
          }
        >
          <UserAvatar size={22} user={params.row} />
          <Spacing horizontal={4} />
          <span className="people-cell">{params.row?.name}</span>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      flex: 2,
      valueGetter: (params) => params.row.email,
    },
    {
      field: 'orgUserRole',
      headerName: 'USER STATUS',
      flex: 0.75,
      valueGetter: (params) => params.row.orgUserRole,
    },
  ];

  return (
    <UsersListContainer>
      {isEmpty(selectableUsers) ? (
        <ListContainer>
          <ListEntryContainer>
            <Grid container justifyContent="center" alignItems="center">
              <OutfitTypography variant="h4">No users found</OutfitTypography>
            </Grid>
          </ListEntryContainer>
        </ListContainer>
      ) : (
        <ReusableDataGrid rows={selectableUsers} columns={columns} />
      )}
    </UsersListContainer>
  );
};

export default UsersList;
