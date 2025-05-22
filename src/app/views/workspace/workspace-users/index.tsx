//@ts-nocheck

import React from "react";

import WorkspaceUsers from './WorkspaceUsers';
import { UserEditProvider } from "@/app/context-api/workspace-user-context";

const WorkspaceUsersWrapper = () => {
  return (
    <UserEditProvider optionNames={['removeOption', 'changeRoleOption']}>
      <WorkspaceUsers />
    </UserEditProvider>
  );
};

export default WorkspaceUsersWrapper;