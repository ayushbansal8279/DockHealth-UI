/* eslint-disable import/prefer-default-export */
import * as ActionTypes from 'actions/action-types';

export function getAnalyticsFilterOptions() {
  return {
    type: ActionTypes.GET_ANALYTICS_FILTER_OPTIONS,
  };
}

export function selectAnalyticsFilter(
  optionCategoryIdentifier,
  optionIdentifier,
) {
  return {
    type: ActionTypes.SELECT_ANALYTICS_FILTER,
    optionCategoryIdentifier,
    optionIdentifier,
  };
}

export function unselectAnalyticsFilter(
  optionCategoryIdentifier,
  optionIdentifier,
) {
  return {
    type: ActionTypes.UNSELECT_ANALYTICS_FILTER,
    optionCategoryIdentifier,
    optionIdentifier,
  };
}

export function clearAnalyticsFilter() {
  return {
    type: ActionTypes.CLEAR_ANALYTICS_FILTER,
  };
}
