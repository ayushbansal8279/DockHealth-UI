import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "@mui/icons-material";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { openModal } from "@/app/modal/actions";
import WorkspaceListTable from "./workspace-lists-table"
import { WorkspaceListsContainer, WorkspaceListsHeader, WorkspaceListsTableWrapper } from "./styled";
import Button from "@/app/components/common/Button/Button";
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { taskListsSelector } from "@/app/selectors/task-list-selectors";
import * as TaskListActions from 'actions/task-list-actions';
import { workspaceSelector } from "@/app/selectors/workspace-selectors";

const WorkspaceLists = () => {
  const dispatch = useDispatch();
  
  const workspace = useSelector(workspaceSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;
  const taskLists = useSelector(taskListsSelector);

  useEffect(() => {
    dispatch(TaskListActions.getTaskListForUser(workspaceIdentifier) as any);
  }, [workspaceIdentifier]);

  const { setSelectableItems } = useContext(BulkEditContext);

  useEffect(() => {
    setSelectableItems(taskLists);
  }, [taskLists]);
  
  const openAddListModal = () => {
    dispatch(openModal('ListForm', {
      showPrivacyOptions: true,
      workspaceIdentifier
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
