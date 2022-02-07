import * as ActionTypes from 'actions/action-types';

const INITIAL_STATE = {
  isLoading: false,
  filters: null,
  selectedFilters: null,
  error: null,
  quickFilters: [],
  addQuickFilterOption: false,
  selectedQuickFilter: null,
};

export default function(state = INITIAL_STATE, action = {}) {
  const { type, error, selectedFilters } = action;
  console.log(type);
  switch (type) {
    case ActionTypes.CLEAN_QUICK_FILTER:
      console.log('CLEAN_QUICK_FILTER');
      return {
        ...state,
        quickFilters: INITIAL_STATE.quickFilters,
        addQuickFilterOption: INITIAL_STATE.addQuickFilterOption,
        selectedQuickFilter: INITIAL_STATE.selectedQuickFilter,
      };
    case ActionTypes.GET_QUICK_FILTERS_SUCCESS:
      return {
        ...state,
        quickFilters: action.quickFilters,
      };
    case ActionTypes.CREATE_QUICK_FILTER_SUCCESS:
      return {
        ...state,
        quickFilters: [action.filter, ...state.quickFilters],
        addQuickFilterOption: false,
        selectedQuickFilter: action.filter.key,
      };
    case ActionTypes.UPDATE_QUICK_FILTER:
      return {
        ...state,
        quickFilters: state.quickFilters.map(filter =>
          filter.key === action.identifier
            ? { ...filter, ...action.dataToUpdate }
            : filter,
        ),
      };
    case ActionTypes.DELETE_QUICK_FILTER:
      return {
        ...state,
        quickFilters: state.quickFilters.filter(
          filter => filter.key !== action.identifier,
        ),
        selectedQuickFilter:
          state.selectedQuickFilter === action.identifier
            ? null
            : state.selectedQuickFilter,
      };
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
