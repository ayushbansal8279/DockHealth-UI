import sort from 'ramda/src/sort';
import { pluck } from 'ramda';
import move from 'ramda/src/move';
import { showGlobalErrorAlert } from '../alert/actions';

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

export const normalizeHyperlink = (value) => {
  if (!value) return "";

  const url = value.replace(/^\/+/, "");

  return /^(https?|ftp):\/\//.test(url) ? url : `https://${url}`;
};

export const getSortedFields = (customFields) => {
  return customFields?.slice().sort((a, b) => a?.sortIndex - b?.sortIndex);
};

export const moveElementByIDs = (originID, destinationID, fields) => {
  if (!originID || !destinationID) return fields;
  const idents = pluck('identifier', fields);
  const indexFrom = idents.indexOf(originID);
  const indexTo = idents.indexOf(destinationID);
  return move(indexFrom, indexTo, fields).map((field, index) => ({
    ...field,
    sortIndex: index,
  }));
};

export const handleDragAndSort = async ({
  originID,
  destinationID,
  sortedFields,
  customFields,
  setCustomFields,
  dispatch,
  apiMethod,
  apiParams
}) => {
  const result = moveElementByIDs(originID, destinationID, sortedFields);
  const lastWorkingOrder = [...customFields];

  setCustomFields(result);

  try {
    await apiMethod(...apiParams(pluck('identifier', result)));
  } catch {
    dispatch(showGlobalErrorAlert());
    setCustomFields(lastWorkingOrder);
  }
};

export const stringToRegex = (str) => {
  const match = str.match(/^\/(.+)\/([a-z]*)$/i);
  if (!match) {
    throw new Error(
      'Invalid regex string format. Expected format: /pattern/flags',
    );
  }

  const pattern = match[1];
  const flags = match[2];
  return new RegExp(pattern, flags);
};
