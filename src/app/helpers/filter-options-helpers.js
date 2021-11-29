/* eslint-disable import/prefer-default-export */

const FilterOptionsLabel = {
  assignedTo: 'Assigned to',
  patients: 'Patients',
  taskLists: 'Task lists',
  assignedBy: 'Assigned by',
  dueDateOptions: 'Due date',
  labels: 'Labels',
  workflowStatusOptions: 'Workflow status',
  priorityOptions: 'Priority',
};

export function mapFilterOptions(filterOptions) {
  return filterOptions.optionsOrder
    .map((optionsGroup, orderIndex) => {
      const options = filterOptions[optionsGroup];
      if (options) {
        return {
          id: optionsGroup,
          label: FilterOptionsLabel[optionsGroup],
          options,
          orderIndex,
        };
      }

      const { customField, options: customFieldOptions } =
        filterOptions.customFields?.find(
          ({ customField: { name } }) => name === optionsGroup,
        ) || {};

      if (customField) {
        return {
          id: customField.identifier,
          label: customField.name,
          options: customFieldOptions || [],
          orderIndex,
        };
      }

      return null;
    })
    .filter(value => !!value);
}
