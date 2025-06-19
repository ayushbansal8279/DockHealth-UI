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

export const extractFolderIdentifier = (url: string) => {
  const workflowLibraryIndex = url.indexOf('workflowLibrary/');
  if (workflowLibraryIndex !== -1) {
    const afterWorkflowLibrary = url.substring(
      workflowLibraryIndex + 'workflowLibrary/'.length,
    );
    const cleanIdentifier = afterWorkflowLibrary.split(/[?#]/)[0];
    return cleanIdentifier || null;
  }
  return null;
};

export const WORKSPACE_WORKFLOW_LIBRARY_PATH = '/core/workspace/:identifier/workflowLibrary/:folderIdentifier?';