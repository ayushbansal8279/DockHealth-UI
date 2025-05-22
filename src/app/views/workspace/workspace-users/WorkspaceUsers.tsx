//@ts-nocheck

import React, { useContext, useEffect } from "react";
import { Add } from "@mui/icons-material";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { WorkspaceUsersHeader, WorkspaceUsersTableWrapper, WorkspaceUsersContainer, StyledActionButtonLabel, StyledActionButtonWrapper } from "./styled";
import WorkspaceUserTable from "./WorkspaceUserTable";
import { workspaceUsersDummyData } from "./helper";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/modal/actions";
import { BulkEditSectionContainer } from "../../user-group/styled";
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { UserEditContext } from "@/app/context-api/workspace-user-context";
import InviteUserToWorkspaceForm from "@/app/components/workspace/InviteUserToWorkspaceForm/InviteUserToWorkspaceForm";

const WorkspaceUsers = () => {
  const dispatch = useDispatch();

  const { setSelectableUsers } = useContext(UserEditContext);

  useEffect(() => {
    setSelectableUsers(workspaceUsersDummyData);
  }, [workspaceUsersDummyData]);

  const refreshMembers = () => {}
  
  const openAddUserModal = () => {
    dispatch(openModal('InviteToList', {
      list: [],
      onMembersRefresh: refreshMembers,
      title: "Add User to the Workspace",
      CustomForm: InviteUserToWorkspaceForm
    }))
  };

  return (
    <WorkspaceUsersContainer>
      <WorkspaceUsersHeader>
        <HeaderSearch />
        <StyledActionButtonWrapper onClick={openAddUserModal}>
          <Add />
          <StyledActionButtonLabel>Add User</StyledActionButtonLabel>
        </StyledActionButtonWrapper>
      </WorkspaceUsersHeader>
      <WorkspaceUsersTableWrapper>
        <WorkspaceUserTable />
      </WorkspaceUsersTableWrapper>
      <BulkEditSection context={UserEditContext}>
        <BulkEditSectionContainer>
          {/* TODO: bulk actions */}
        </BulkEditSectionContainer>
      </BulkEditSection>
    </WorkspaceUsersContainer>
  );
};

export default WorkspaceUsers;