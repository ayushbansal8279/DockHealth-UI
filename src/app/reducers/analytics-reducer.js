import * as ActionTypes from 'actions/action-types';

const initialState = {
  filters: null,
  selectedFilters: null,
  isLoadingFilters: false,
};

const AnalyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_ANALYTICS_FILTER_OPTIONS: {
      return {
        ...state,
        isLoadingFilters: true,
      };
    }

    case ActionTypes.GET_ANALYTICS_FILTER_OPTIONS_SUCCESS: {
      return {
        ...state,
        isLoadingFilters: false,
        filters: action.filters,
      };
    }

    case ActionTypes.GET_ANALYTICS_FILTER_OPTIONS_FAILURE: {
      return {
        ...state,
        isLoadingFilters: false,
      };
    }

    case ActionTypes.SET_ANALYTICS_SELECTED_FILTERS: {
      const { selectedFilters } = action;

      return {
        ...state,
        selectedFilters,
      };
    }

    case ActionTypes.CLEAR_ANALYTICS_FILTER:
      return {
        ...state,
        selectedFilters: null,
      };

    default:
      return state;
  }
};

export default AnalyticsReducer;
