import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function getAnalyticsFilterOptions() {
  return axios
    .get(`task/filter/filterOptionsForAnalytics`)
    .then(({ data }) => mapFilterOptions(data));
}

export function getGroupedStatistics(groupType) {
  return axios
    .get(`analytics/groupedStats/${groupType}`)
    .then(({ data }) => data);
}

export function getFilteredGroupedStatistics(groupType, selectedFilters) {
  return axios
    .post(
      `analytics/filterGroupedStats/${groupType}`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
    )
    .then(({ data }) => data);
}

export function getTrendsByDate(trendType) {
  return axios
    .get(`analytics/trendsByDate/${trendType}`)
    .then(({ data }) => data);
}

export function getFilteredTrendsByDate(trendType, selectedFilters) {
  return axios
    .post(
      `analytics/filterTaskTrendsByDate/${trendType}`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
    )
    .then(({ data }) => data);
}
