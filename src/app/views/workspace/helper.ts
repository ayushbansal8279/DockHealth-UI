import WorkspaceLists from './workspace-lists';
import WorkspacePatients from './workspace-patients';
import WorkspaceUsers from './workspace-users';
import WorkspaceWorkflowLibrary from './workspace-worlkflow-library/WorkspaceWorkflowLibrary';
import ObjectsTab from '../data-management/components/ObjectsTab';
import FieldLibraryTab from '../data-management/components/FieldLibraryTab';

export const TABS_CONFIG = (customerTypeLabel: string) => [
  {
    label: 'Users',
    mainPath: 'users',
    RouteComponent: WorkspaceUsers,
  },
  {
    label:
      customerTypeLabel.charAt(0).toUpperCase() + customerTypeLabel.slice(1),
    mainPath: 'patients',
    additionalPath: 'list/:listIdentifier?',
    RouteComponent: WorkspacePatients,
  },
  {
    label: 'Lists',
    mainPath: 'lists',
    RouteComponent: WorkspaceLists,
  },
  {
    label: 'Workflow Library  ',
    mainPath: 'workflowLibrary',
    additionalPath: ':folderIdentifier?',
    RouteComponent: WorkspaceWorkflowLibrary,
  },
  {
    label: 'Objects',
    mainPath: 'objects',
    RouteComponent: ObjectsTab,
    isWorkspace: true,
  },
  {
    label: 'Field Library',
    mainPath: 'field-library',
    RouteComponent: FieldLibraryTab,
    isWorkspace: true,
  },
];

export const DEFAULT_TAB = {
  label: 'Users',
  mainPath: 'users',
  RouteComponent: WorkspaceUsers,
};
