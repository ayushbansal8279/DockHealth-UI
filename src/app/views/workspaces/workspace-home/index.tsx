import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Workspace, Workspace as WorkspaceType } from "@/app/types/workspace";
import WorkspaceTile from "@/app/components/workspace/WorkspaceTile/WorkspaceTile";
import { OutfitTypography } from "@/app/styles/theme";
import Spacing from "@/app/components/common/Spacing";
import { StyledDataGrid } from "../workspace-table/styled";
import { AddWorkspaceButtonWrapper, ListContainer, ListEntryContainer, WorkspaceContainer, WorkspaceTableWrapper } from "./styled";
import { MoreVertIcon } from "../../workspace/styled";
import WorkspaceOptionsMenu from "@/app/components/workspace/WorkspaceOptionsMenu/WorkspaceOptionsMenu";
import ViewLayout from "@/app/components/template/ViewLayout/ViewLayout";
import BasicLayoutHeader from "@/app/components/template/BasicLayoutHeader/BasicLayoutHeader";
import { isFetchingWorkspaceListSelector, workspaceListSelector } from "@/app/selectors/workspace-list-selector";
import { getAllUserWorkspaces } from "@/app/actions/workspace-list-actions";
import { closeModal, openModal } from "@/app/modal/actions";
import { Add } from "@mui/icons-material";
import ToolbarButton from "@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton";
import { organizationWorkspaceLabelSelector } from "@/app/selectors/organization-selectors";
import pluralize from 'pluralize';
import { userHasWorkspacesFeatureSelector } from "@/app/selectors/user-selectors";

const WorkspaceHome = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const workspaces = useSelector(workspaceListSelector);
  const isFetching = useSelector(isFetchingWorkspaceListSelector);
  const [menuOptionsOpen, setMenuOptionsOpen] = useState(false);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

  const workspacesAvailable = useSelector(userHasWorkspacesFeatureSelector);
  if (!workspacesAvailable) {
    history.push(`/core/home`);
  }

  useEffect(() => {
    dispatch(getAllUserWorkspaces());
  }, []);

  const openAddWorkspaceModal = () => {
    const modalProps = {
      onConfirm: async (createdWorkspace: Workspace) => {
        dispatch(closeModal());
        handleWorkspaceSelect(createdWorkspace.workspaceIdentifier);
      },
    };
    dispatch(openModal('AddWorkspace', modalProps));
  };

  const handleWorkspaceSelect = (workspaceIdentifier: string) => {
    history.push(`/core/workspace/${workspaceIdentifier}`);
  };

  const columns: GridColDef<any>[] = [
    {
      field: 'workspaceName',
      headerName: `${workspaceLabel} Name`,
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
      header={<BasicLayoutHeader title={`All ${pluralize(workspaceLabel)}`} />}
    >
      <WorkspaceContainer>
        <AddWorkspaceButtonWrapper>
          <ToolbarButton
            icon={
              <span style={{ marginLeft: '-5px' }}>
                <Add />
              </span>
            }
            onClick={openAddWorkspaceModal}
          >
            <span style={{ marginLeft: '-5px' }}>Add {workspaceLabel}</span>
          </ToolbarButton>
        </AddWorkspaceButtonWrapper>
        {isFetching ? (
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
