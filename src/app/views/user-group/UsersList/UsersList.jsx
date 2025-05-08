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

const UsersList = (props) => {
  const { users, searchTerm } = props;
  const history = useHistory();

  const userContext = useContext(UserEditContext);
  const {
    selectableUsers,
    setSelectableUsers,
    isListChecked,
    toggleUser,
    toggleAllUser
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
    [usersWithId, searchTerm]
  );

  useEffect(() => {
    setSelectableUsers(filteredUsers);
  }, [filteredUsers]);

  const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }) => (
    <BulkContainer>
      <Checkbox isChecked={isListChecked} onClick={onListSelect} />
    </BulkContainer>
  );

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
        <DataGrid
          fluid
          dataset={selectableUsers}
          hideFooterSelectedRowCount
          autoHeight
        >
          <Data
            name="SELECT"
            field="isSelected"
            headerRenderer={() =>
              renderCheckboxColumnHeader({
                isListChecked,
                onListSelect: toggleAllUser,
              })
            }
            value={(data) =>
              <TaskItemBulkEdit
                isChecked={data?.isSelected}
                onClick={() => toggleUser(data.id)}
              />
            }
            unsortable
            flex={0.15}
          />
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
