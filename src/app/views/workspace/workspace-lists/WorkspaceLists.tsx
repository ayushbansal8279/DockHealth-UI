import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { openModal } from "@/app/modal/actions";
import WorkspaceListTable from "./workspace-lists-table"
import { WorkspaceListsContainer, WorkspaceListsHeader, WorkspaceListsTableWrapper } from "./styled";
import Button from "@/app/components/common/Button/Button";
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { workspaceListsDummyData } from "./helpers";

const WorkspaceLists = () => {
  const dispatch = useDispatch();

  const { setSelectableItems } = useContext(BulkEditContext);
  
  useEffect(() => {
    setSelectableItems(workspaceListsDummyData);
  }, [workspaceListsDummyData]);
  
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
      <BulkEditSection>
        <BulkEditSectionContainer>
        </BulkEditSectionContainer>
      </BulkEditSection>
    </WorkspaceListsContainer>
  );
};

export default WorkspaceLists;
