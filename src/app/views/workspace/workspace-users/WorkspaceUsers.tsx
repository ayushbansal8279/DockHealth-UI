import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "@mui/icons-material";

import { openModal } from "@/app/modal/actions";
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import InviteUserToWorkspaceForm from "@/app/components/workspace/InviteUserToWorkspaceForm/InviteUserToWorkspaceForm";
import { getWorkspaceUsers } from "@/app/actions/workspace-actions";
import { isFetchingWorkspaceUsersSelector, workspaceSelector, workspaceUsersSelector } from "@/app/selectors/workspace-selectors";
import ListSkeletonLoader from "@/app/components/common/ListSkeletonLoader/ListSkeletonLoader";
import ToolbarButton from "@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton";
import SearchInput from "@/app/components/common/SearchInput/SearchInput";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { WorkspaceContextProvider } from "./WorkspaceContext";
import WorkspaceUserTable from "./workspace-user-table";
import { organizationWorkspaceLabelSelector } from "@/app/selectors/organization-selectors";
import { WorkspaceUsersHeader, WorkspaceUsersTableWrapper, WorkspaceUsersContainer, ListLoaderContainer } from "./styled";

const WorkspaceUsers = () => {
  const dispatch = useDispatch();
  const workspace = useSelector(workspaceSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;
  const users = useSelector(workspaceUsersSelector);
  const isLoading = useSelector(isFetchingWorkspaceUsersSelector);
  // const [searchTerm, setSearchTerm] = useState('');
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

  const usersWithSelection = useMemo(() => {
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

  const { setSelectableItems } = useContext(BulkEditContext);

  useEffect(() => {
    if (workspaceIdentifier) {
      setSelectableItems(usersWithSelection);
    }
  }, [usersWithSelection, setSelectableItems, workspaceIdentifier]);

  const openAddUserModal = () => {
    dispatch(
      openModal('InviteToList', {
        list: [],
        title: `Add User to the ${workspaceLabel}`,
        CustomForm: InviteUserToWorkspaceForm,
        identifier: workspaceIdentifier,
      }),
    );
  };

  return (
    <WorkspaceContextProvider workspaceIdentifier={workspaceIdentifier}>
      <WorkspaceUsersContainer>
        <WorkspaceUsersHeader>
          {/* <SearchInput
            value={searchTerm}
            onValueChange={setSearchTerm}
          /> */}
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
        <BulkEditSection>
          <BulkEditSectionContainer></BulkEditSectionContainer>
        </BulkEditSection>
      </WorkspaceUsersContainer>
    </WorkspaceContextProvider>
  );
};

export default WorkspaceUsers;