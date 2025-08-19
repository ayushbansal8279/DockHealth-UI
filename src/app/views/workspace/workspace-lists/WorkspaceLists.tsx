import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "@mui/icons-material";

import { openModal } from "@/app/modal/actions";
import WorkspaceListTable from "./workspace-lists-table"
import BulkEditSection from "@/app/components/workspace/BulkEditSection/BulkEditSection";
import { BulkEditSectionContainer } from "../../user-group/styled";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { archivedWorkspaceTaskListsSelector, isFetchingWorkspaceTaskListsSelector, workspaceSelector, workspaceTaskListsSelector } from "@/app/selectors/workspace-selectors";
import ToolbarButton from "@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton";
import ListSkeletonLoader from "@/app/components/common/ListSkeletonLoader/ListSkeletonLoader";
import { ListLoaderContainer, WorkspaceListsContainer, WorkspaceListsHeader, WorkspaceListsTableWrapper } from "./styled";
import { getArchivedWorkspaceTaskLists, getWorkspaceTaskLists } from "@/app/actions/workspace-actions";
import SearchInput from "@/app/components/common/SearchInput/SearchInput";

const WorkspaceLists = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  
  const workspace = useSelector(workspaceSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;
  const taskLists = useSelector(workspaceTaskListsSelector);
  const isFetching = useSelector(isFetchingWorkspaceTaskListsSelector);
  const archivedTaskLists = useSelector(archivedWorkspaceTaskListsSelector);
  const { setSelectableItems } = useContext(BulkEditContext);

  useEffect(() => {
    if (workspaceIdentifier) {
      dispatch(getWorkspaceTaskLists(workspaceIdentifier));
      dispatch(getArchivedWorkspaceTaskLists(workspaceIdentifier));
    }
  }, [workspaceIdentifier]);

  const allTaskLists = useMemo(() => {
    return [...taskLists, ...(archivedTaskLists || [])];
  }, [taskLists, archivedTaskLists]);

  useEffect(() => {
    if (workspaceIdentifier) {
      setSelectableItems(allTaskLists);
    }
  }, [workspaceIdentifier, allTaskLists]);
  
  const openAddListModal = () => {
    dispatch(openModal('ListForm', {
      showPrivacyOptions: true,
      workspaceIdentifier
    }));
  }

  return (
    <WorkspaceListsContainer>
      <WorkspaceListsHeader>
        <SearchInput
          value={searchTerm}
          onValueChange={setSearchTerm}
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
      {isFetching ? (
        <ListLoaderContainer>
          <ListSkeletonLoader header />
        </ListLoaderContainer>
      ) : (
        <WorkspaceListsTableWrapper>
          <WorkspaceListTable searchTerm={searchTerm} />
        </WorkspaceListsTableWrapper>
      )}
      <BulkEditSection>
        <BulkEditSectionContainer>
        </BulkEditSectionContainer>
      </BulkEditSection>
    </WorkspaceListsContainer>
  );
};

export default WorkspaceLists;
