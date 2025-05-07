import WorkspaceConfigure from "./workspace-configure/WorkspaceConfigure";
import WorkspaceManage from "./workspace-manage/WorkspaceManage";

export const TABS_CONFIG = [
  {
    label: 'Configure',
    mainPath: 'configure',
    RouteComponent: WorkspaceConfigure,
  },
  {
    label: 'Manage',
    mainPath: 'manage',
    RouteComponent: WorkspaceManage,
  },
];

export const INITIAL_TABS_CONFIG = [
  {
    label: 'Configure',
    mainPath: 'configure',
    RouteComponent: WorkspaceConfigure,
  },
];

export const DEFAULT_TAB = TABS_CONFIG[0];
