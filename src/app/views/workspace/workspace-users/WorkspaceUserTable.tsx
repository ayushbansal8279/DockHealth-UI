// @ts-nocheck

import React, { useContext } from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid-premium";

import Checkbox from "@/app/components/common/Checkbox/Checkbox";
import TaskItemBulkEdit from "@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit";
import { BulkContainer, StyledDataGrid } from "./styled";
import { CheckboxHeaderProps, CheckboxProps, IWorkspaceUser } from "./types";
import { UserEditContext } from "@/app/context-api/workspace-user-context";
import palette from "@/app/styles/palette";

const TypedCheckbox = Checkbox as React.FC<CheckboxProps>;

const WorkspaceUserTable = () => {

  const apiRef = useGridApiRef();

  const userContext = useContext(UserEditContext);
  const {
    selectableUsers: users,
    isListChecked,
    toggleUser,
    toggleAllUser
  } = userContext;

  const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }: CheckboxHeaderProps) => (
    <BulkContainer>
      <TypedCheckbox 
        isChecked={isListChecked} 
        onClick={onListSelect} 
      />
    </BulkContainer>
  );
  
  const handleRoleChange = () => {}

  const columns: GridColDef<IWorkspaceUser>[] = [
    {
      field: 'isSelected',
      headerName: 'SELECT',
      flex: 0.25,
      sortable: false,
      headerClassName: 'no-sort-icon',
      renderHeader: () =>
        renderCheckboxColumnHeader({
          isListChecked,
          onListSelect: toggleAllUser,
        }),
      renderCell: ({ row }) => (
        <TaskItemBulkEdit
          isChecked={row?.isSelected}
          onClick={() => toggleUser(row.id)}
          isDisabled={false}
        />
      ),
    },    
    {
      field: 'name',
      headerName: 'Users',
      flex: 1.75,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
    },
    {
      field: 'role',
      headerName: 'Workspace role',
      flex: 0.75,
      renderCell: ({ row }) => (
        <Select
          value={row.role}
          onChange={handleRoleChange}
          size="small"
          fullWidth
          variant="standard"
          disableUnderline
          sx={{
            backgroundColor: 'transparent',
            '& .MuiSelect-select': {
              padding: 0,
              fontSize: '14px',
            },
          }}
        >
          <MenuItem value="member">Member</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
  ),
    },
    {
      field: 'status',
      headerName: 'Active',
      flex: 0.75,
    },
  ];

  let rows: IWorkspaceUser[] = users || [];

  return (
    <Box sx={{ height: 'calc(80vh - 100px)', p: 2, width: '1179px' }}>
      <StyledDataGrid
        apiRef={apiRef}
        columns={columns}
        getRowId={(row) => row.identifier}
        rows={rows}
        rowHeight={40}
        columnHeaderHeight={50}
      />
    </Box>
  )
}

export default WorkspaceUserTable;