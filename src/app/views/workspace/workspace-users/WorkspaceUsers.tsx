import React, { useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { openModal } from "@/app/modal/actions";
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { UserEditContext } from "@/app/context-api/workspace-user-context";
import InviteUserToWorkspaceForm from "@/app/components/workspace/InviteUserToWorkspaceForm/InviteUserToWorkspaceForm";
import { getWorkspaceUsers } from "@/app/actions/workspace-actions";
import { isFetchingWorkspaceUsersSelector, workspaceUsersSelector } from "@/app/selectors/workspace-selectors";
import ListSkeletonLoader from "@/app/components/common/ListSkeletonLoader/ListSkeletonLoader";
import ToolbarButton from "@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { WorkspaceContextProvider } from "./WorkspaceContext";
import WorkspaceUserTable from "./workspace-user-table";
import { WorkspaceUsersHeader, WorkspaceUsersTableWrapper, WorkspaceUsersContainer, ListLoaderContainer } from "./styled";

const WorkspaceUsers = () => {
  const dispatch = useDispatch();

  const { identifier: workspaceIdentifier } = useParams<{ identifier: string }>();

  const users = useSelector(workspaceUsersSelector);
  const isLoading = useSelector(isFetchingWorkspaceUsersSelector);

  const usersWithSelection	 = useMemo(() => {
    return users?.map((user) => ({
      isSelected: false,
      ...user,
    }));
  }, [users]);  

  useEffect(() => {
    if (workspaceIdentifier) {
      dispatch(getWorkspaceUsers(workspaceIdentifier));
    }
  }, [workspaceIdentifier, dispatch]);

  const { setSelectableUsers } = useContext(UserEditContext);

  useEffect(() => {
    setSelectableUsers(usersWithSelection	);
  }, [usersWithSelection	]);
  
  const openAddUserModal = () => {
    dispatch(openModal('InviteToList', {
      list: [],
      title: "Add User to the Workspace",
      CustomForm: InviteUserToWorkspaceForm,
      identifier: workspaceIdentifier,
    }))
  };

  return (
    <WorkspaceContextProvider workspaceIdentifier={workspaceIdentifier}>
      <WorkspaceUsersContainer>
        <WorkspaceUsersHeader>
          <HeaderSearch />
          <ToolbarButton
            icon={
              <span style={{ marginLeft: '-5px' }}>
                <Add />
              </span>
            }
            onClick={openAddUserModal}
          >
            <span style={{ marginLeft: '-5px' }}>Add User</span>
          </ToolbarButton>
        </WorkspaceUsersHeader>
          {isLoading ? (
            <ListLoaderContainer>
              <ListSkeletonLoader header />
            </ListLoaderContainer>
          ) : (
            <WorkspaceUsersTableWrapper>
              <WorkspaceUserTable />
            </WorkspaceUsersTableWrapper>
          )}
        <BulkEditSection context={UserEditContext}>
          <BulkEditSectionContainer>
            {/* TODO: bulk actions */}
          </BulkEditSectionContainer>
        </BulkEditSection>
      </WorkspaceUsersContainer>
    </WorkspaceContextProvider>
  );
};

export default WorkspaceUsers;