import WorkspaceLists from './workspace-lists';
import WorkspacePatients from './workspace-patients';
import WorkspaceUsers from './workspace-users';
import WorkspaceWorkflowLibrary from './workspace-worlkflow-library/WorkspaceWorkflowLibrary';

export const TABS_CONFIG = [
  {
    label: 'Users',
    mainPath: 'users',
    RouteComponent: WorkspaceUsers,
  },
  {
    label: 'Lists',
    mainPath: 'lists',
    RouteComponent: WorkspaceLists,
  },
  {
    label: 'Patients ',
    mainPath: 'patients',
    additionalPath: 'list/:listIdentifier?',
    RouteComponent: WorkspacePatients,
  },
  {
    label: 'Workflow Library  ',
    mainPath: 'workflowLibrary',
    additionalPath: ':folderIdentifier?',
    RouteComponent: WorkspaceWorkflowLibrary,
  },
];

export const DEFAULT_TAB = TABS_CONFIG[0];