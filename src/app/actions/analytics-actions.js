import * as ActionTypes from 'actions/action-types';

export function getAnalyticsFilterOptions() {
  return {
    type: ActionTypes.GET_ANALYTICS_FILTER_OPTIONS,
  };
}

export function setAnalyticsSelectedFilters(selectedFilters) {
  return {
    type: ActionTypes.SET_ANALYTICS_SELECTED_FILTERS,
    selectedFilters,
  };
}

export function clearAnalyticsFilter() {
  return {
    type: ActionTypes.CLEAR_ANALYTICS_FILTER,
  };
}
