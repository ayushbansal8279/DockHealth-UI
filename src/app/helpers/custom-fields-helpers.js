import sort from 'ramda/src/sort';

export const BOOL_SELECT_OPTIONS = [
  {
    value: null,
    label: 'None',
  },
  {
    value: 'no',
    label: 'No',
  },
  {
    value: 'yes',
    label: 'Yes',
  },
];

export const CUSTOM_FIELD_TYPES = {
  REGULAR: 'REGULAR',
  TASK_LIST: 'TASK_LIST',
  ORGANIZATION: 'ORGANIZATION',
  PATIENT: 'PATIENT',
};

export const sortAlphabetical = (array, propertyName = 'name') =>
  sort((a, b) => a?.[propertyName].localeCompare(b?.[propertyName]), array);

export const createMetaDataObjectToSend = (metaDataField) => {
  if (metaDataField?.value) {
    return {
      customFieldIdentifier: metaDataField?.customFieldIdentifier,
      value: metaDataField?.value,
    };
  }
  if (metaDataField?.values) {
    return {
      customFieldIdentifier: metaDataField?.customFieldIdentifier,
      values: metaDataField?.values,
    };
  }

  return null;
};

export const getSortedCategorizedCustomFields = (fields) => {
  const sortedFields = [...fields].sort((a, b) => a.sortIndex - b.sortIndex);
  const res = {};

  for (const field of sortedFields) {
    if (!res[field.fieldCategoryType]) {
      res[field.fieldCategoryType] = [];
    }
    res[field.fieldCategoryType].push(field);
  }

  return res;
};
