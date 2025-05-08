// @ts-nocheck
import React from 'react';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Box } from '@mui/material';
import AvatarFilterMember from '@/app/components/user/AvatarFilterMember/AvatarFilterMember';
import { useHistory } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { StyledDataGrid } from './styled';

const WorkspaceTable = ({ workspaces }) => {
  const apiRef = useGridApiRef();
  const history = useHistory();
  const columns = [
    {
      field: 'name',
      headerName: 'Workspace Name',
      flex: 1,
    },
    {
      field: 'users',
      headerName: 'Users',
      flex: 1,
      renderCell: ({ row }) => {
        const users = row.users;

        // TODO : Functionality to Add Users to workspace
        // Refrence Invite Users to List on List page

        return (
          <div style={{ display: 'flex' }}>
            {users.map((user, index) => {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  key={user.identifier}
                  pl={index === 0 ? 0 : 0.5}
                >
                  <AvatarFilterMember member={user} size={30} />
                  <Box pl={0.5}></Box>
                </Box>
              );
            })}
          </div>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 0.5,
      renderCell: ({ row }) => {
        const newPath = `/settings/workspace/${row.identifier}`;

        // TODO : Modal and Update and Delete Workspace

        return (
          <div>
            <ArrowForwardIcon
              onClick={() => {
                history.push(newPath);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 'calc(80vh - 100px)', p: 2, width: '1179px' }}>
      <StyledDataGrid
        apiRef={apiRef}
        columns={columns}
        getRowId={(row) => row.identifier}
        editMode="row"
        rows={workspaces}
        rowHeight={40}
        columnHeaderHeight={50}
        showCellVerticalBorder={false}
        showColumnVerticalBorder={false}
      />
    </Box>
  );
};

export default WorkspaceTable;
