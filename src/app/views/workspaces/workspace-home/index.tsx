import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import { getAllUserWorkspaces } from "@/app/api/workspace-api";
import { Workspace as WorkspaceType } from "@/app/types/workspace";
import WorkspaceTile from "@/app/components/workspace/WorkspaceTile/WorkspaceTile";
import { OutfitTypography } from "@/app/styles/theme";
import Spacing from "@/app/components/common/Spacing";
import { StyledDataGrid } from "../workspace-table/styled";
import { ListContainer, ListEntryContainer, WorkspaceContainer, WorkspaceTableWrapper } from "./styled";
import { useHistory } from "react-router-dom";
import { MoreVertIcon } from "../../workspace/styled";
import WorkspaceOptionsMenu from "@/app/components/workspace/WorkspaceOptionsMenu/WorkspaceOptionsMenu";
import ViewLayout from "@/app/components/template/ViewLayout/ViewLayout";
import BasicLayoutHeader from "@/app/components/template/BasicLayoutHeader/BasicLayoutHeader";

const WorkspaceHome = () => {
  const history = useHistory();
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOptionsOpen, setMenuOptionsOpen] = useState(false);
  
  useEffect(() => {
    (async () => {
      const workspaces = await getAllUserWorkspaces();
      setWorkspaces(workspaces);
      setLoading(false);
    })();
  }, []);

  const handleWorkspaceSelect = (workspaceIdentifier: string) => {
    history.push(`/core/workspace/${workspaceIdentifier}`);
  };

  const columns: GridColDef<any>[] = [
    {
      field: 'workspaceName',
      headerName: 'Workspace Name',
      flex: 1.8,
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleWorkspaceSelect(row.workspaceIdentifier)}
          >
            <WorkspaceTile
              workspaceProfileColor={row?.workspaceProfileColor}
              workspaceInitials={row?.workspaceInitials}
              />
            <Spacing horizontal={4} />
            <Typography variant="body2">{row?.workspaceName}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'options',
      headerName: 'Options',
      flex: 0.2,
      renderCell: ({ row }) => (
        <WorkspaceOptionsMenu
          onClose={() => setMenuOptionsOpen(false)}
          open={menuOptionsOpen}
          selectedWorkspace={row}
        >
          <MoreVertIcon />
        </WorkspaceOptionsMenu>
      )
    },
  ]

  return (
    <ViewLayout
      header={<BasicLayoutHeader title="All Workspaces" />}
    >
      <WorkspaceContainer>
        {loading ? (
          <ListContainer>
            <ListEntryContainer>
              <Grid container justifyContent="center" alignItems="center">
                <OutfitTypography variant="h4">No workspaces found</OutfitTypography>
              </Grid>
            </ListEntryContainer>
          </ListContainer>
        ) : (
          <WorkspaceTableWrapper>
            <StyledDataGrid
              columns={columns}
              getRowId={(row) => row.workspaceIdentifier}
              rows={workspaces}
              rowHeight={50}
              headerHeight={45}
              hideFooterSelectedRowCount
              slots={{
                footer: () => null,
              }}
            />
          </WorkspaceTableWrapper>
        )}
      </WorkspaceContainer>
    </ViewLayout>
  )
}

export default WorkspaceHome;
