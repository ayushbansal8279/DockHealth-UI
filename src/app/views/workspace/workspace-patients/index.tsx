import React from "react";

import WorkspacePatients from "./WorkspacePatients";
import { PatientListColumnsConfigProvider } from "@/app/context-api/patients-columns-config-context";

const WorkspacePatientsWrapper = () => {
  return (
    <PatientListColumnsConfigProvider>
      <WorkspacePatients />
    </PatientListColumnsConfigProvider>
  );
};

export default WorkspacePatientsWrapper;