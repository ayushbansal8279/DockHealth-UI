import React from "react";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { openModal } from "@/app/modal/actions";
import WorkspaceListTable from "./workspace-lists-table"
import { WorkspaceListsContainer, WorkspaceListsHeader, WorkspaceListsTableWrapper } from "./styled";
import Button from "@/app/components/common/Button/Button";

const WorkspaceLists = () => {
  const dispatch = useDispatch();
  
  const openAddListModal = () => {
    dispatch(openModal('ListForm', {
      showPrivacyOptions: true,
    }));
  }

  return (
    <WorkspaceListsContainer>
      <WorkspaceListsHeader>
        <HeaderSearch />
        <Button 
          onClick={openAddListModal}
          uppercase={false}
          width='fit-content'
          startIcon={<Add/>}
          size='small'
        >
          Add List
        </Button>
      </WorkspaceListsHeader>
      <WorkspaceListsTableWrapper>
        <WorkspaceListTable />
      </WorkspaceListsTableWrapper>
    </WorkspaceListsContainer>
  );
};

export default WorkspaceLists;
