import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "@mui/icons-material";

import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { openModal } from "@/app/modal/actions";
import WorkspaceListTable from "./workspace-lists-table"
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { taskListsSelector } from "@/app/selectors/task-list-selectors";
import * as TaskListActions from 'actions/task-list-actions';
import { workspaceSelector } from "@/app/selectors/workspace-selectors";
import ToolbarButton from "@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton";
import { WorkspaceListsContainer, WorkspaceListsHeader, WorkspaceListsTableWrapper } from "./styled";

const WorkspaceLists = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  
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
        <HeaderSearch 
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <ToolbarButton
          icon={
            <span style={{ marginLeft: '-5px' }}>
              <Add />
            </span>
          }
          onClick={openAddListModal}
        >
          <span style={{ marginLeft: '-5px' }}>Add List</span>
        </ToolbarButton>
      </WorkspaceListsHeader>
      <WorkspaceListsTableWrapper>
        <WorkspaceListTable searchTerm={searchTerm} />
      </WorkspaceListsTableWrapper>
      <BulkEditSection>
        <BulkEditSectionContainer>
        </BulkEditSectionContainer>
      </BulkEditSection>
    </WorkspaceListsContainer>
  );
};

export default WorkspaceLists;
