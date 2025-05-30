import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { openModal } from "@/app/modal/actions";
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { UserEditContext } from "@/app/context-api/workspace-user-context";
import InviteUserToWorkspaceForm from "@/app/components/workspace/InviteUserToWorkspaceForm/InviteUserToWorkspaceForm";
import Button from "@/app/components/common/Button/Button";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { workspaceUsersDummyData } from "./helper";
import WorkspaceUserTable from "./workspace-user-table";
import { WorkspaceUsersHeader, WorkspaceUsersTableWrapper, WorkspaceUsersContainer } from "./styled";

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
        <Button
          onClick={openAddUserModal}
          startIcon={<Add/>}
          uppercase={false}
          width='fit-content'
          size='small'
        >
          Add User
        </Button>
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