import { clone } from 'ramda';
import * as types from 'actions/action-types';

const PEOPLE_FILTERS = ['assignedBy', 'assignedTo'];
const PRIORITY_FILTERS = ['priorityOptions'];
const STATUS_FILTERS = ['workflowStatusOptions'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STANDARD_FILTERS = ['labels', 'dueDateOptions', 'patients'];
const IS_AVAILABLE_UNASSIGNED = ['assignedTo', 'patients'];

const getLabel = label =>
  label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, string => string.toUpperCase())
    .replace(' Options', '');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assignTypesToFilters = ({ optionsOrder, ...filters }) => {
  const assignedFilters = clone(filters);
  Object.keys(filters).forEach(key => {
    if (PEOPLE_FILTERS.includes(key)) {
      assignedFilters[key] = {
        label: getLabel(key),
        list: assignedFilters[key],
        type: 'PEOPLE',
        hasAvatars: true,
      };
    } else if (PRIORITY_FILTERS.includes(key)) {
      assignedFilters[key] = {
        label: getLabel(key),
        list: assignedFilters[key],
        type: 'PRIORITY',
      };
    } else if (STATUS_FILTERS.includes(key)) {
      assignedFilters[key] = {
        label: getLabel(key),
        list: assignedFilters[key],
        type: 'STATUS',
      };
    } else {
      assignedFilters[key] = {
        label: getLabel(key),
        list: assignedFilters[key],
        type: 'STANDARD',
      };
    }
    if (IS_AVAILABLE_UNASSIGNED.includes(key)) {
      assignedFilters[key] = {
        ...assignedFilters[key],
        isAvailableUnassgined: true,
      };
    }
  });

  return optionsOrder?.map(option => assignedFilters[option]);
};

const INITIAL_STATE = {
  isLoading: false,
  filters: {},
  selectedFilters: {},
  error: null,
};

export default function(state = INITIAL_STATE, action = {}) {
  const { type, filters, error, selectedFilters } = action;

  switch (type) {
    case types.FETCH_MEGA_FILTERS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.FETCH_MEGA_FILTERS_SUCCESS:
      return {
        ...state,
        filters: assignTypesToFilters(filters),
        isLoading: false,
      };
    case types.FETCH_MEGA_FILTERS_FAILURE:
      return { ...state, error, isLoading: false };
    case types.SELECT_FILTERS_FROM_MEGA_FILTER:
      return { ...state, selectedFilters };
    case types.CLEAR_MEGA_FILTERS:
      return INITIAL_STATE;
    default:
      return state;
  }
}
