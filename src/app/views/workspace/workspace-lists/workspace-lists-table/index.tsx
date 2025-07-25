// @ts-nocheck

import React, { useContext, useMemo } from "react";
import { Box, Button } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createFilter } from 'react-search-input';
import { useHistory } from "react-router-dom";

import AvatarFilterMember from "@/app/components/user/AvatarFilterMember/AvatarFilterMember";
import Checkbox from "@/app/components/common/Checkbox/Checkbox";
import TaskItemBulkEdit from "@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit";
import AssignMemberIcon from "@/app/components/user/AssignMemberIcon/AssingMemberIcon";
import ListOptionsMenu from "@/app/components/tasklist/ListOptionsMenu/ListOptionsMenu";
import { openModal } from "@/app/modal/actions";
import { StyledDataGrid } from "@/app/views/workspaces/workspace-table/styled";
import { workspaceListsDummyData } from "../helpers";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { getFilteredRows } from "@/app/helpers/workspace-helpers";
import { workspaceSelector } from "@/app/selectors/workspace-selectors";
import Tooltip from "@/app/components/common/Tooltip/Tooltip";
import { createTaskListPath } from "@/app/routing/helpers/paths";
import { WorkspaceContainer } from "@/app/views/workspaces/workspace-home/styled";
import { AssignMemberIconContainer, BulkContainer, StyledListLink } from "./styled";

const WorkspaceListTable = ({ searchTerm }: { searchTerm: string }) => {
  const dispatch = useDispatch();
  const history = useHistory();

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
      onMembersRefresh: refreshMembers,
      workspaceIdentifier,
    }))
  };

  const columns = [
    // {
    //   field: 'isSelected',
    //   headerName: 'SELECT',
    //   flex: 0.5,
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
    //       onClick={() => toggleItem(row.taskListIdentifier)}
    //       isDisabled={false}
    //     />
    //   ),
    // },
    {
      field: 'listName',
      headerName: 'Name',
      flex: 3,
      renderCell: ({ row }) => {
        const { taskListIdentifier, listName } = row;
        return (
          <StyledListLink
            onClick={() => {
              history.push(
                createTaskListPath(taskListIdentifier),
              );
            }}
          > 
            {listName}
          </StyledListLink>
        )
      }
    },
    {
      field: 'listType',
      headerName: 'List type',
      flex: 1,
      renderCell: ({ row }) => {
        const listType = row.listType;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {listType}
          </div>
        );
      },
    },
    {
      field: 'archived',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row }) => {
        const archived = row.archived;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {archived ? 'Archived' : 'Active'}
          </div>
        );
      },
    },
    {
      field: 'users',
      headerName: 'Users',
      flex: 1,
      renderCell: ({ row }) => {
        const users = row.users;
        return (
          <div style={{ display: 'flex' }}>
            {users?.map((user, index) => (
              <Box
                display="flex"
                alignItems="center"
                key={user.identifier}
                pl={index === 0 ? 0 : 0.5}
              >
                <AvatarFilterMember member={user} size={30} />
                <Box pl={0.5}></Box>
              </Box>
            ))}
            <Tooltip placement="bottom" title="Add Users">
              <AssignMemberIconContainer onClick={() => openAddUserModal(row)}>
                <AssignMemberIcon size={30} />
              </AssignMemberIconContainer>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 0.5,
      renderCell: ({ row }) => (
        <ListOptionsMenu list={row} workspaceIdentifier={workspaceIdentifier}>
          <MoreVert color="primary" /> 
        </ListOptionsMenu>
      )
    },
  ];

  const filteredRows = useMemo(
    () => getFilteredRows(lists, searchTerm, ['listName']),
    [lists, searchTerm],
  );

  return (
    <WorkspaceContainer>
      <StyledDataGrid
        columns={columns}
        getRowId={(row) => row.taskListIdentifier}
        rows={filteredRows}
        rowHeight={40}
        headerHeight={45}
        autoHeight
        hideFooterSelectedRowCount
      />
    </WorkspaceContainer>
  );
};

export default WorkspaceListTable;
