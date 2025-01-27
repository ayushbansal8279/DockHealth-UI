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

export default (state = INITIAL_STATE, action = {}) => {
  const { type, error, selectedFilters, selectedQuickFilter } = action;
  switch (type) {
    case ActionTypes.CLEAN_QUICK_FILTER: {
      return {
        ...state,
        quickFilters: INITIAL_STATE.quickFilters,
        addQuickFilterOption: INITIAL_STATE.addQuickFilterOption,
        selectedQuickFilter: INITIAL_STATE.selectedQuickFilter,
      };
    }
    case ActionTypes.GET_QUICK_FILTERS_SUCCESS: {
      return {
        ...state,
        quickFilters: action.quickFilters,
      };
    }
    case ActionTypes.CREATE_QUICK_FILTER_SUCCESS: {
      return {
        ...state,
        quickFilters: [action.filter, ...state.quickFilters],
        addQuickFilterOption: false,
        selectedQuickFilter: action.filter.quickFilterIdentifier,
      };
    }
    case ActionTypes.UPDATE_QUICK_FILTER: {
      return {
        ...state,
        quickFilters: state.quickFilters.map((filter) =>
          filter.quickFilterIdentifier === action.quickFilterIdentifier
            ? { ...filter, ...action.dataToUpdate }
            : filter,
        ),
      };
    }
    case ActionTypes.DELETE_QUICK_FILTER: {
      return {
        ...state,
        quickFilters: state.quickFilters.filter(
          (filter) =>
            filter.quickFilterIdentifier !== action.quickFilterIdentifier,
        ),
        selectedQuickFilter:
          state.selectedQuickFilter === action.quickFilterIdentifier
            ? null
            : state.selectedQuickFilter,
      };
    }
    case ActionTypes.HIDE_ADD_QUICK_FILTER_OPTION: {
      return {
        ...state,
        addQuickFilterOption: false,
      };
    }
    case ActionTypes.SHOW_ADD_QUICK_FILTER_OPTION: {
      return {
        ...state,
        addQuickFilterOption: true,
      };
    }
    case ActionTypes.SELECT_QUICK_FILTER: {
      return {
        ...state,
        selectedQuickFilter: action.quickFilterIdentifier,
      };
    }

    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS:
    case ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ActionTypes.GET_PATIENT_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS_SUCCESS: {
      return {
        ...state,
        filters: action.filters,
        isLoading: false,
      };
    }

    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_FAILURE: {
      return { ...state, error, isLoading: false };
    }

    case ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER: {
      return { ...state, selectedFilters, selectedQuickFilter };
    }

    case ActionTypes.CLEAR_MEGA_FILTERS: {
      return INITIAL_STATE;
    }

    default: {
      return state;
    }
  }
};
