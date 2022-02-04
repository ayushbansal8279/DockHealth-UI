import * as ActionTypes from 'actions/action-types';

const INITIAL_STATE = {
  isLoading: false,
  filters: null,
  selectedFilters: null,
  error: null,
  quickFilters: [
    {
      displayValue: 'My private filter',
      key: 'test-identifier-00001',
      filters: {
        assignedTo: {
          options: ['UNASSIGNED'],
        },
        patients: {
          options: ['421d0711-e564-4381-8243-b624a6a25b8c'],
        },
        priorityOptions: {
          options: ['LOW'],
        },
      },
    },
    {
      displayValue: 'Custom Filter 1',
      key: 'test-identifier-00002',
      filters: {
        assignedTo: {
          options: ['UNASSIGNED'],
        },
        patients: {
          options: ['421d0711-e564-4381-8243-b624a6a25b8c'],
        },
      },
    },
    {
      displayValue: 'My handy filter',
      key: 'test-identifier-00003',
      filters: {
        assignedTo: {
          options: ['UNASSIGNED'],
        },
      },
    },
  ],
  addQuickFilterOption: false,
  selectedQuickFilter: null,
};

export default function(state = INITIAL_STATE, action = {}) {
  const { type, error, selectedFilters } = action;

  switch (type) {
    case ActionTypes.HIDE_ADD_QUICK_FILTER_OPTION:
      return {
        ...state,
        addQuickFilterOption: false,
      };
    case ActionTypes.SHOW_ADD_QUICK_FILTER_OPTION:
      return {
        ...state,
        addQuickFilterOption: true,
      };
    case ActionTypes.SELECT_QUICK_FILTER:
      return {
        ...state,
        selectedQuickFilter: action.identifier,
      };

    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.GET_PATIENT_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        filters: action.filters,
        isLoading: false,
      };

    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_FAILURE:
      return { ...state, error, isLoading: false };

    case ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER:
      return { ...state, selectedFilters };

    case ActionTypes.CLEAR_MEGA_FILTERS:
      return INITIAL_STATE;

    default:
      return state;
  }
}
