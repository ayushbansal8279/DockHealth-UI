import { isEmpty, isNil } from 'ramda';

export const FilterOptionsCategory = {
  ASSIGNED_TO: 'assignedTo',
  PATIENTS: 'patients',
  TASK_LISTS: 'taskLists',
  ASSIGNED_BY: 'assignedBy',
  DUE_DATE: 'taskDueDateOptions',
  LABELS: 'labels',
  WORKFLOW_STATUS: 'workflowStatusOptions',
  PRIORITY: 'priorityOptions',
  COMPLETE_DATE: 'taskCompletedDateOptions',
  CREATED_DATE: 'taskCreatedDateOptions',
  TASK_STATUS: 'taskStatusOptions',
};

const FilterOptionsLabel = {
  [FilterOptionsCategory.ASSIGNED_TO]: 'Assigned to',
  [FilterOptionsCategory.PATIENTS]: 'Patients',
  [FilterOptionsCategory.TASK_LISTS]: 'Task lists',
  [FilterOptionsCategory.ASSIGNED_BY]: 'Assigned by',
  [FilterOptionsCategory.DUE_DATE]: 'Due date',
  [FilterOptionsCategory.LABELS]: 'Labels',
  [FilterOptionsCategory.WORKFLOW_STATUS]: 'Workflow status',
  [FilterOptionsCategory.PRIORITY]: 'Priority',
  [FilterOptionsCategory.COMPLETE_DATE]: 'Task completed date',
  [FilterOptionsCategory.CREATED_DATE]: 'Task created date',
  [FilterOptionsCategory.TASK_STATUS]: 'Status',
};

const DATE_FILTER_OPTIONS = [
  FilterOptionsCategory.DUE_DATE,
  FilterOptionsCategory.COMPLETE_DATE,
  FilterOptionsCategory.CREATED_DATE,
];

export function mapFilterOptions(filterOptions) {
  return filterOptions.optionsOrder
    .map((optionsGroup, orderIndex) => {
      const options = filterOptions[optionsGroup];
      if (options) {
        return {
          id: optionsGroup,
          label: FilterOptionsLabel[optionsGroup] || '',
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

export function mapSelectedOptionsToRequestPayload(selectedFilters) {
  if (!selectedFilters) return null;

  return Object.entries(selectedFilters).reduce((accumulator, [k, v]) => {
    if (DATE_FILTER_OPTIONS.includes(k)) {
      return {
        ...accumulator,
        [k]: {
          dateEnd: v.dateEnd || null,
          dateStart: v.dateStart || null,
          dateOptions: v.options,
        },
      };
    }

    if (Object.values(FilterOptionsCategory).includes(k)) {
      return {
        ...accumulator,
        [k]: v.options,
      };
    }

    return {
      ...accumulator,
      customFields: [
        ...(accumulator.customFields || []),
        {
          customFieldIdentifier: k,
          selectedOptionIdentifiers: v.options,
        },
      ],
    };
  }, {});
}

export function mapRequestSelectedOptionsToStore(selectedOptions) {
  if (!selectedOptions) return null;

  return Object.entries(selectedOptions).reduce((accumulator, [k, v]) => {
    if (!v) return accumulator;
    if (DATE_FILTER_OPTIONS.includes(k)) {
      return {
        ...accumulator,
        [k]: {
          dateEnd: v.dateEnd || null,
          dateStart: v.dateStart || null,
          options: v.dateOptions,
        },
      };
    }

    if (Object.values(FilterOptionsCategory).includes(k)) {
      if (v?.length === 0 || v === '') return accumulator;
      return {
        ...accumulator,
        [k]: { options: v },
      };
    }

    return {
      ...accumulator,
      ...v.reduce(
        (a, c) => ({
          ...a,
          [c.customFieldIdentifier]: { options: c.selectedOptionIdentifiers },
        }),
        {},
      ),
    };
  }, {});
}

function clearEmptyFilterOptions(selectedFilters) {
  return Object.entries(selectedFilters).reduce(
    (accumulator, [optionCategoryId, value]) => {
      const optionValue = {};

      Object.entries(value || {}).forEach(([k, v]) => {
        if (!isNil(v) && !isEmpty(v)) {
          optionValue[k] = v;
        }
      });

      if (!isEmpty(optionValue)) {
        return {
          ...(accumulator || {}),
          [optionCategoryId]: optionValue,
        };
      }

      return accumulator;
    },
    null,
  );
}

export function setFilterRangeStartDate(
  optionCategoryIdentifier,
  rangeValue,
  selectedFilters,
) {
  const newSelectedFilters = {
    ...(selectedFilters || {}),
    [optionCategoryIdentifier]: {
      ...(selectedFilters?.[optionCategoryIdentifier] || {}),
      dateStart: rangeValue,
    },
  };

  return clearEmptyFilterOptions(newSelectedFilters);
}

export function setFilterRangeEndDate(
  optionCategoryIdentifier,
  rangeValue,
  selectedFilters,
) {
  const newSelectedFilters = {
    ...(selectedFilters || {}),
    [optionCategoryIdentifier]: {
      ...(selectedFilters?.[optionCategoryIdentifier] || {}),
      dateEnd: rangeValue,
    },
  };

  return clearEmptyFilterOptions(newSelectedFilters);
}

export function selectFilterOption(
  optionCategoryIdentifier,
  optionIdentifier,
  selectedFilters,
) {
  return {
    ...(selectedFilters || {}),
    [optionCategoryIdentifier]: {
      ...(selectedFilters?.[optionCategoryIdentifier] || {}),
      options: [
        ...(selectedFilters?.[optionCategoryIdentifier]?.options || []),
        optionIdentifier,
      ],
    },
  };
}

export function unselectFilterOption(
  optionCategoryIdentifier,
  optionIdentifier,
  selectedFilters,
) {
  const newSelectedFilters = {
    ...(selectedFilters || {}),
    [optionCategoryIdentifier]: {
      ...(selectedFilters?.[optionCategoryIdentifier] || {}),
      options:
        selectedFilters?.[optionCategoryIdentifier]?.options?.filter(
          id => id !== optionIdentifier,
        ) || null,
    },
  };

  return clearEmptyFilterOptions(newSelectedFilters);
}

export function isOptionSelected(
  optionCategoryIdentifier,
  optionIdentifier,
  selectedFilters,
) {
  return Boolean(
    selectedFilters?.[optionCategoryIdentifier]?.options?.includes(
      optionIdentifier,
    ),
  );
}

export function extractSelectedOptions(
  optionCategoryIdentifier,
  selectedFilters,
) {
  return selectedFilters?.[optionCategoryIdentifier]?.options;
}
