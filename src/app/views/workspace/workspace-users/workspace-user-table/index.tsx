// @ts-nocheck

import React, { useContext, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-premium";
import { isEmpty } from "ramda";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createFilter } from 'react-search-input';

import Checkbox from "@/app/components/common/Checkbox/Checkbox";
import TaskItemBulkEdit from "@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { OutfitTypography } from "@/app/styles/theme";
import UserTypeOptions from "@/app/views/self-serve/users/UserTypeOptions/UserTypeOptions";
import { changeWorkspaceUserRole } from "@/app/actions/workspace-actions";
import UserAvatar from "@/app/components/user/UserAvatar/UserAvatar";
import Spacing from "@/app/components/common/Spacing";
import { RoleContextProvider } from "../RoleContext";
import { StyledDataGrid } from "../../../workspaces/workspace-table/styled";
import { CheckboxHeaderProps, CheckboxProps, IWorkspaceUser } from "../types";
import { getFilteredRows } from "@/app/helpers/workspace-helpers";
import { BulkContainer, ListContainer, ListEntryContainer } from "./styled";

const TypedCheckbox = Checkbox as React.FC<CheckboxProps>;

const WorkspaceUserTable = ({ searchTerm }: { searchTerm: string }) => {
  const dispatch = useDispatch();
  const { identifier: workspaceIdentifier } = useParams<{ identifier: string }>();

  const userContext = useContext(BulkEditContext);
  const {
    selectableItems: users,
    isListChecked,
    toggleItem,
    toggleAllItems
  } = userContext;

  const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }: CheckboxHeaderProps) => (
    <BulkContainer>
      <TypedCheckbox 
        isChecked={isListChecked} 
        onClick={onListSelect} 
      />
    </BulkContainer>
  );

  const changeUserRole = ({ userIdentifier, role }) => {
    dispatch(changeWorkspaceUserRole({ workspaceIdentifier, userIdentifier, role }));
  }

  const columns: GridColDef<IWorkspaceUser>[] = [
    // {
    //   field: 'isSelected',
    //   headerName: 'SELECT',
    //   flex: 0.25,
    //   sortable: false,
    //   headerClassName: 'no-sort-icon',
    //   renderHeader: () =>
    //     renderCheckboxColumnHeader({
    //       isListChecked,
    //       onListSelect: toggleAllItems,
    //     }),
    //   renderCell: ({ row }) => (
    //     <TaskItemBulkEdit
    //       isChecked={row?.isSelected}
    //       onClick={() => toggleItem(row.identifier)}
    //       isDisabled={false}
    //     />
    //   ),
    // },
    {
      field: 'name',
      headerName: 'Users',
      flex: 1.75,
      renderCell: ({ row }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserAvatar size={22} user={row} />
            <Spacing horizontal={4} />
            <span>{row?.name}</span>
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
    },
    {
      field: 'workspaceUserRole',
      headerName: 'Workspace role',
      flex: 0.6,
      renderCell: ({ row }) => {
        const { firstName, lastName, email, userIdentifier, userStatus } = row;
        const key = `${firstName}${lastName}${userIdentifier}${email}`;

        return (
          <UserTypeOptions
            key={key}
            isUserSelected={() => false}
            showJoined={true}
            showSubscription={true}
            organizationMembers={[]}
            isInvited={userStatus === 'INVITED'}
            userIdentifier={userIdentifier}
            selectedUsers={[]}
            changeUserRole={changeUserRole}
            orgUserRole={row.workspaceUserRole}
            {...row}
          />
        );
      },
    }
  ];

  const filteredRows = useMemo(
    () => getFilteredRows<IWorkspaceUser>(users, searchTerm, ['name', 'email']),
    [users, searchTerm],
  );

  return (
    <Box sx={{ height: 'calc(80vh - 100px)', p: 2, width: '1179px' }}>
      {isEmpty(users) ? (
        <ListContainer>
          <ListEntryContainer>
            <Grid container justifyContent="center" alignItems="center">
              <OutfitTypography variant="h4">No users found</OutfitTypography>
            </Grid>
          </ListEntryContainer>
        </ListContainer>
      ) : (
        <RoleContextProvider contextType="workspace">
          <StyledDataGrid
            columns={columns}
            getRowId={(row) => row.identifier}
            rows={filteredRows}
            rowHeight={40}
            headerHeight={45}
            autoHeight
            hideFooterSelectedRowCount
          />
        </RoleContextProvider>
      )}
    </Box>
  )
}

export default WorkspaceUserTable;