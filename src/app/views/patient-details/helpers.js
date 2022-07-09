/* eslint-disable import/no-cycle */
import PatientTasksList from './PatientTasksList/PatientTasksList';
import PatientNotes from './PatientNotes/PatientNotes';
import PatientAttachments from './PatientAttachments/PatientAttachments';

export const ListViewType = {
  LIST_VIEW: 'list-view',
  ALL_TASKS: 'all',
};

export const LIST_TYPE_OPTIONS = [
  {
    label: 'List View',
    value: ListViewType.LIST_VIEW,
  },
  {
    label: 'All Tasks',
    value: ListViewType.ALL_TASKS,
  },
];

export const TABS_CONFIG = [
  {
    label: 'All tasks',
    mainPath: 'tasks',
    additionalPath: ':taskListIdentifier?',
    RouteComponent: PatientTasksList,
    exact: true,
  },
  {
    label: 'Notes',
    mainPath: 'notes',
    RouteComponent: PatientNotes,
  },
  {
    label: 'Files',
    mainPath: 'files',
    additionalPath: ':folderIdentifier?',
    RouteComponent: PatientAttachments,
  },
];

export const DEFAULT_TAB = TABS_CONFIG[0];
