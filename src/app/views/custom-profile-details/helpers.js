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
    .map(
      (field) => {
        if (["MULTI_SELECT", "PICK_LIST", "RELATIONSHIP"].includes(field.profileTypeFieldType)) {
          const reference = field.references?.find(
            (ref) => ref.identifier === field.values?.[0]
          );
          return reference?.displayValue || "";
        }
        return (
          field.values?.[0] ||
          field.values?.[0].value ||
          field.values?.[0]?.customFieldOption?.name
        )
      }
    );
    return profileName;
};
