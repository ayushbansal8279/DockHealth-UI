import WorkspaceLists from './workspace-lists';
import WorkspacePatients from './workspace-patients/WorkspacePatients';
import WorkspaceUsers from './workspace-users';

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
    RouteComponent: WorkspacePatients,
  },
  {
    label: 'Workflow Library  ',
    mainPath: 'workflowLibrary',
    RouteComponent: WorkspaceLists,
  },
];

export const DEFAULT_TAB = TABS_CONFIG[0];
