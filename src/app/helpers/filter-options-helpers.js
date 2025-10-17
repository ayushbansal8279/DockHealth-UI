import moment from 'moment';
import isEmpty from 'ramda/src/isEmpty';
import isNil from 'ramda/src/isNil';

export const FilterOptionsCategory = {
  ASSIGNED_TO: 'assignedTo',
  PATIENTS: 'patients',
  ORGANIZATIONS: 'organizations',
  TASK_LISTS: 'taskLists',
  ASSIGNED_BY: 'assignedBy',
  DUE_DATE: 'taskDueDateOptions',
  LABELS: 'labels',
  PATIENT_LABELS: 'patientLabels',
  WORKFLOW_STATUS: 'workflowStatusOptions',
  PRIORITY: 'priorityOptions',
  COMPLETE_DATE: 'taskCompletedDateOptions',
  CREATED_DATE: 'taskCreatedDateOptions',
  TASK_STATUS: 'taskStatusOptions',
  ESCALATED: 'escalatedStatusOptions',
  CREATED_BY: 'createdBy',
  COMPLETED_BY: 'completedBy',
  EVENT_TYPES: 'eventTypes',
  EVENT_SUB_TYPES: 'eventSubTypes',
  EVENT_DATE_OPTIONS: 'eventDateOptions',
  WORKFLOWS: 'workflows',
  PATIENT_LABELS: 'patientLabels',
};

const FilterOptionsLabel = {
  [FilterOptionsCategory.ASSIGNED_TO]: 'Assigned to',
  [FilterOptionsCategory.PATIENTS]: 'Patient',
  [FilterOptionsCategory.ORGANIZATIONS]: 'Organization',
  [FilterOptionsCategory.TASK_LISTS]: 'Task List',
  [FilterOptionsCategory.ASSIGNED_BY]: 'Assigned by',
  [FilterOptionsCategory.DUE_DATE]: 'Due date',
  [FilterOptionsCategory.LABELS]: 'Task Label',
  [FilterOptionsCategory.PATIENT_LABELS]: 'Patient Label',
  [FilterOptionsCategory.WORKFLOW_STATUS]: 'Workflow Status',
  [FilterOptionsCategory.PRIORITY]: 'Priority',
  [FilterOptionsCategory.COMPLETE_DATE]: 'Task completed date',
  [FilterOptionsCategory.CREATED_DATE]: 'Task created date',
  [FilterOptionsCategory.TASK_STATUS]: 'Completed Status',
  [FilterOptionsCategory.ESCALATED]: 'Escalated',
  [FilterOptionsCategory.CREATED_BY]: 'Created By',
  [FilterOptionsCategory.COMPLETED_BY]: 'Completed By',
  [FilterOptionsCategory.EVENT_TYPES]: 'Event Type',
  [FilterOptionsCategory.EVENT_SUB_TYPES]: 'Event Sub Type',
  [FilterOptionsCategory.EVENT_DATE_OPTIONS]: 'Event Date Options',
  [FilterOptionsCategory.WORKFLOWS]: 'Workflows',
  [FilterOptionsCategory.PATIENT_LABELS]: 'Patient Label',
};

const DATE_FILTER_OPTIONS = new Set([
  FilterOptionsCategory.DUE_DATE,
  FilterOptionsCategory.COMPLETE_DATE,
  FilterOptionsCategory.CREATED_DATE,
]);

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
    .filter((value) => !!value);
}

export function mapSelectedOptionsToRequestPayload(selectedFilters) {
  if (!selectedFilters) return null;

  return Object.entries(selectedFilters).reduce((accumulator, [k, v]) => {
    if (DATE_FILTER_OPTIONS.has(k)) {
      return {
        ...accumulator,
        [k]: {
          dateEnd: v.dateEnd || null,
          dateStart: v.dateStart || null,
          dateOptions: v.options,
          date: v.date || null,
        },
      };
    }

    if (Object.values(FilterOptionsCategory).includes(k)) {
      return {
        ...accumulator,
        [k]: v.options,
      };
    }

    if (v.dateStart || v.dateEnd || v.date) {
      return {
        ...accumulator,
        customFields: [
          ...(accumulator.customFields || []),
          {
            customFieldIdentifier: k,
            selectedOptionIdentifiers: v.options,
            dateStart: v.dateStart || null,
            dateEnd: v.dateEnd || null,
            date: v.date || null,
          },
        ],
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
    if (DATE_FILTER_OPTIONS.has(k)) {
      return {
        ...accumulator,
        [k]: {
          dateEnd: v.dateEnd ? moment.utc(v.dateEnd).format("YYYY-MM-DD") : null,
          dateStart: v.dateStart ? moment.utc(v.dateStart).format("YYYY-MM-DD") : null,
          options: v.dateOptions,
          date: v.date || null,
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
      ...Object.fromEntries(
        v.map((c) => [
          c.customFieldIdentifier,
          { options: c.selectedOptionIdentifiers },
        ]),
      ),
    };
  }, {});
}

function clearEmptyFilterOptions(selectedFilters) {
  return Object.entries(selectedFilters).reduce(
    (accumulator, [optionCategoryId, value]) => {
      const optionValue = {};

      for (const [k, v] of Object.entries(value || {})) {
        if (!isNil(v) && !isEmpty(v)) {
          optionValue[k] = v;
        }
      }

      if (!isEmpty(optionValue)) {
        return {
          ...accumulator,
          [optionCategoryId]: optionValue,
        };
      }

      return accumulator;
    },
    null,
  );
}

export function setFilterRangeDate(
  optionCategoryIdentifier,
  startDate,
  endDate,
  selectedFilters,
) {
  const newSelectedFilters = {
    ...(selectedFilters || {}),
    [optionCategoryIdentifier]: {
      ...(selectedFilters?.[optionCategoryIdentifier] || {}),
      dateStart: startDate,
      dateEnd: endDate,
    },
  };

  return clearEmptyFilterOptions(newSelectedFilters);
}

export function setFilterRangeStartDate(
  optionCategoryIdentifier,
  rangeValue,
  selectedFilters,
) {
  const newSelectedFilters = {
    ...selectedFilters,
    [optionCategoryIdentifier]: {
      ...selectedFilters?.[optionCategoryIdentifier],
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
    ...selectedFilters,
    [optionCategoryIdentifier]: {
      ...selectedFilters?.[optionCategoryIdentifier],
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
    ...selectedFilters,
    [optionCategoryIdentifier]: {
      ...selectedFilters?.[optionCategoryIdentifier],
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
    ...selectedFilters,
    [optionCategoryIdentifier]: {
      ...selectedFilters?.[optionCategoryIdentifier],
      options:
        selectedFilters?.[optionCategoryIdentifier]?.options?.filter(
          (id) => id !== optionIdentifier,
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
