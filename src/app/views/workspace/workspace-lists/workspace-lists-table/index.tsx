// @ts-nocheck

import React, { useContext, useMemo } from "react";
import { Box, Button } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createFilter } from 'react-search-input';

import AvatarFilterMember from "@/app/components/user/AvatarFilterMember/AvatarFilterMember";
import Checkbox from "@/app/components/common/Checkbox/Checkbox";
import TaskItemBulkEdit from "@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit";
import AssignMemberIcon from "@/app/components/user/AssignMemberIcon/AssingMemberIcon";
import ListOptionsMenu from "@/app/components/tasklist/ListOptionsMenu/ListOptionsMenu";
import { openModal } from "@/app/modal/actions";
import { EditableLabel } from "@/app/components/workspace/EditableLabel/EditableLabel";
import { StyledDataGrid } from "@/app/views/workspaces/workspace-table/styled";
import { workspaceListsDummyData } from "../helpers";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { getFilteredRows } from "@/app/helpers/workspace-helpers";
import { workspaceSelector } from "@/app/selectors/workspace-selectors";
import { BulkContainer } from "./styled";

const WorkspaceListTable = ({ searchTerm }: { searchTerm: string }) => {
  const dispatch = useDispatch();

  const workspace = useSelector(workspaceSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;

  const listContext = useContext(BulkEditContext);
  const {
    selectableItems: lists,
    isListChecked,
    toggleItem,
    toggleAllItems
  } = listContext;

  const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }) => (
    <BulkContainer>
      <Checkbox 
        isChecked={isListChecked} 
        onClick={onListSelect} 
      />
    </BulkContainer>
  );

  const refreshMembers = () => {}

  const openAddUserModal = (list) => {
    dispatch(openModal('InviteToList', {
      list,
      onMembersRefresh: refreshMembers
    }))
  };

  const columns = [
    {
      field: 'isSelected',
      headerName: 'SELECT',
      flex: 0.5,
      sortable: false,
      headerClassName: 'no-sort-icon',
      renderHeader: () =>
        renderCheckboxColumnHeader({
          isListChecked,
          onListSelect: toggleAllItems,
        }),
      renderCell: ({ row }) => (
        <TaskItemBulkEdit
          isChecked={row?.isSelected}
          onClick={() => toggleItem(row.taskListIdentifier)}
          isDisabled={false}
        />
      ),
    },
    {
      field: 'listName',
      headerName: 'Name',
      flex: 3,
      renderCell: ({ row }) => (
        <EditableLabel 
          value={row.listName}
          placeholder="Enter List Name"
          onEdit={(newName) => console.log('Edited:', newName)}
          tooltip={row.listName}
        />
      )
    },
    {
      field: 'listType',
      headerName: 'List type',
      flex: 1,
      renderCell: ({ row }) => {
        const listType = row.listType;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {listType === 'PRIVATE' ? (
              <>
                <LockOutlinedIcon fontSize="small" /> Private
              </>
            ) : (
              'Public'
            )}
          </div>
        );
      },
    },
    // {
    //   field: 'users',
    //   headerName: 'Users',
    //   flex: 1,
    //   renderCell: ({ row }) => {
    //     const users = row.users;
    //     return (
    //       <div style={{ display: 'flex', marginLeft: '15px' }}>
    //         {users?.length}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: 'admins',
    //   headerName: 'Admins',
    //   flex: 2,
    //   renderCell: ({ row }) => {
    //     const admins = row.admins;
    //     return (
    //       <div style={{ display: 'flex' }}>
    //         {admins?.map((admin, index) => (
    //           <Box
    //             display="flex"
    //             alignItems="center"
    //             key={admin.identifier}
    //             pl={index === 0 ? 0 : 0.5}
    //           >
    //             <AvatarFilterMember member={admin} size={30} />
    //             <Box pl={0.5}></Box>
    //           </Box>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button onClick={() => openAddUserModal(row)}>
            <AssignMemberIcon size={20} />
          </Button>
          <ListOptionsMenu list={row} workspaceIdentifier={workspaceIdentifier}>
            <MoreVert color="primary" /> 
          </ListOptionsMenu>
        </div>
      )
    },
  ];

  const filteredRows = useMemo(
    () => getFilteredRows(lists, searchTerm, ['listName']),
    [lists, searchTerm],
  );

  return (
    <Box sx={{ height: 'calc(80vh - 100px)', p: 2, width: '1179px' }}>
      <StyledDataGrid
        columns={columns}
        getRowId={(row) => row.taskListIdentifier}
        rows={filteredRows}
        rowHeight={40}
        headerHeight={45}
        autoHeight
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default WorkspaceListTable;
