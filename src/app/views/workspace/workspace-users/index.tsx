import React from "react";

import WorkspaceUsers from './WorkspaceUsers';
import { BulkEditProvider } from "@/app/context-api/bulk-edit-context";
import { listBulkOptions } from "./workspaceUserBulkOption";

const WorkspaceUsersWrapper = () => {
  return (
    <BulkEditProvider bulkOptions={listBulkOptions} viewType="user">
      <WorkspaceUsers />
    </BulkEditProvider>
  );
};

export default WorkspaceUsersWrapper;