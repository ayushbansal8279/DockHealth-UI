import React from "react";

import WorkspaceLists from "./WorkspaceLists";
import { BulkEditProvider } from "@/app/context-api/bulk-edit-context";
import { listBulkOptions } from "./workspaceListBulkOptions";

const WorkspaceListsWrapper = () => {
  return (
    <BulkEditProvider bulkOptions={listBulkOptions} viewType="list">
      <WorkspaceLists />
    </BulkEditProvider>
  );
};

export default WorkspaceListsWrapper;