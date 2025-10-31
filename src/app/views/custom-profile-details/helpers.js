import ProfileAttachments from './ProfileAttachments/ProfileAttachments';
import ProfileNotes from './ProfileNotes/ProfileNotes';
import ProfilePatientView from './ProfilePatient/ProfilePatientView';
import ProfileTasksListView from './ProfileTasksList/ProfileTasksList';

export const ListViewType = {
  LIST_VIEW: 'list-view',
  ALL_TASKS: 'all',
};

export const LIST_TYPE_OPTIONS = [
  {
    label: 'List View',
    value: ListViewType.LIST_VIEW,
    disabled: true,
  },
  {
    label: 'All Tasks',
    value: ListViewType.ALL_TASKS,
  },
];

export const getProfileName = (profileTypeFields, profile) => {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const profileName = profile?.fields
    ?.filter((field) => {
      const profileTypeField = profileTypeFields?.find(
        (ptField) => ptField.identifier === field?.profileTypeFieldIdentifier,
      );
      return profileTypeField?.displayOptions?.includes('PROFILE_NAME');
    })
    .map((field) => {
      if (
        ['MULTI_SELECT', 'PICK_LIST', 'RELATIONSHIP'].includes(
          field.profileTypeFieldType,
        )
      ) {
        const reference = field.references?.find(
          (ref) => ref.identifier === field.values?.[0],
        );
        return reference?.displayValue || '';
      }
      return (
        field.values?.[0] ||
        field.values?.[0].value ||
        field.values?.[0]?.customFieldOption?.name
      );
    });
  return profileName;
};

export const getProfileNameDisplayAndIds = (profileTypeFields, profile) => {
  if (!profile?.fields?.length) {
    return { parts: ['', '', ''], identifiers: [null, null, null] };
  }

  const resolveDisplayValue = (field) => {
    if (!field) return '';

    if (
      ['MULTI_SELECT', 'PICK_LIST', 'RELATIONSHIP'].includes(
        field.profileTypeFieldType,
      )
    ) {
      const firstRaw = field.values?.[0];
      const key =
        typeof firstRaw === 'string'
          ? firstRaw
          : firstRaw?.value ?? firstRaw?.identifier;
      if (!key) return '';
      const ref = field.references?.find((r) => r.identifier === key);
      return ref?.displayValue ?? String(key ?? '');
    }

    const raw = field.values?.[0];
    if (!raw) return '';
    if (typeof raw === 'string') return raw;
    if (raw?.value) return raw.value;
    if (raw?.customFieldOption?.name) return raw.customFieldOption.name;
    return String(raw ?? '');
  };

  const profileNameFields = profile.fields.filter((field) => {
    const ptField = profileTypeFields?.find(
      (p) => p.identifier === field?.profileTypeFieldIdentifier,
    );
    return ptField?.displayOptions?.includes('PROFILE_NAME');
  });

  const resolved = profileNameFields
    .map((field) => ({
      id: field.identifier,
      display: resolveDisplayValue(field),
    }))
    .filter((x) => x.display?.toString().trim());

  const firstThree = resolved.slice(0, 3);

  const get = (arr, idx) => (arr[idx] ? arr[idx].display : '');
  const getId = (arr, idx) => (arr[idx] ? arr[idx].id : null);

  const parts = [
    get(firstThree, 1) || '',
    get(firstThree, 0) || '',
    get(firstThree, 2) || '',
  ];

  const identifiers = [
    getId(firstThree, 1),
    getId(firstThree, 0),
    getId(firstThree, 2),
  ];

  return { parts, identifiers };
};

export const TABS_CONFIG = [
  {
    label: 'All tasks',
    mainPath: 'tasks',
    additionalPath: ':taskListIdentifier?',
    RouteComponent: ProfileTasksListView,
    exact: true,
  },
  {
    label: 'Notes',
    mainPath: 'notes',
    RouteComponent: ProfileNotes,
  },
  {
    label: 'Patients',
    mainPath: 'patients',
    RouteComponent: ProfilePatientView,
  },
  {
    label: 'Files',
    mainPath: 'files',
    additionalPath: ':folderIdentifier?',
    RouteComponent: ProfileAttachments,
  },
];

export const DEFAULT_TABS_CONFIG = [TABS_CONFIG[0]];
