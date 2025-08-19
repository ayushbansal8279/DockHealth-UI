import WorkspaceConfigure from "./workspace-configure/WorkspaceConfigure";

export const TABS_CONFIG = [
  {
    label: 'Configure',
    mainPath: 'configure',
    RouteComponent: WorkspaceConfigure,
  },
];

export const DEFAULT_TAB = TABS_CONFIG[0];
