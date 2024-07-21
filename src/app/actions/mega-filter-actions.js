import {
  getFiltersStorageKey,
  getQuickFilterStorageKey,
  getFiltersFromLocalStorage,
  getQuickFilterFromLocalStorage,
} from 'helpers/mega-filter-helper';
import * as ActionTypes from './action-types';
import localStorageHelper from '../helpers/local-storage-helper';

export const quickContextTypes = {
  MY_TASKS: 'MY_TASKS',
  ALL_TASKS: 'ALL_TASKS',
  ANALYTICS: 'ANALYTICS',
  PATIENTS: 'PATIENTS',
};

export function clearFiltersForMegaFilter() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_MEGA_FILTERS });
  };
}

export function selectFiltersFromLocalStorage(id, status) {
  return (dispatch) => {
    const initialFilters = getFiltersFromLocalStorage(id, status);
    const initialQuickFilter = getQuickFilterFromLocalStorage(id, status);

    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters: initialFilters || {},
      selectedQuickFilter: initialQuickFilter || [],
    });
  };
}

export function selectFiltersForMegaFilter(
  selectedFilters,
  id,
  status,
  selectedQuickFilter,
) {
  return (dispatch) => {
    if (selectedFilters) {
      localStorageHelper.setItem(
        getFiltersStorageKey(id, status),
        selectedFilters,
      );
      localStorageHelper.setItem(
        getQuickFilterStorageKey(id, status),
        selectedQuickFilter,
      );
    } else {
      localStorageHelper.removeItem(getFiltersStorageKey(id, status));
      localStorageHelper.removeItem(getQuickFilterStorageKey(id, status));
    }

    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters,
      selectedQuickFilter,
      id,
      status,
    });
  };
}

export const getQuickFilters = (viewSpecificData) => ({
  type: ActionTypes.GET_QUICK_FILTERS,
  viewSpecificData,
});

export const getAnalyticsQuickFilters = () => ({
  type: ActionTypes.GET_QUICK_FILTERS,
  viewSpecificData: { contextType: quickContextTypes.ANALYTICS },
});

export const createQuickAnalyticsFilter = (name, selectedOptions) => ({
  type: ActionTypes.CREATE_QUICK_FILTER,
  name,
  viewSpecificData: { contextType: quickContextTypes.ANALYTICS },
  selectedOptions,
});

export const updateQuickAnalyticsFilter = (
  quickFilterIdentifier,
  dataToUpdate,
) => ({
  type: ActionTypes.UPDATE_QUICK_FILTER,
  dataToUpdate,
  quickFilterIdentifier,
  viewSpecificData: { contextType: quickContextTypes.ANALYTICS },
});

export const createQuickFilter = (name, viewSpecificData, selectedOptions) => ({
  type: ActionTypes.CREATE_QUICK_FILTER,
  name,
  viewSpecificData,
  selectedOptions,
});

export const updateQuickFilter = (
  quickFilterIdentifier,
  dataToUpdate,
  viewSpecificData,
) => ({
  type: ActionTypes.UPDATE_QUICK_FILTER,
  dataToUpdate,
  quickFilterIdentifier,
  viewSpecificData,
});

export const deleteQuickFilter = (quickFilterIdentifier) => ({
  type: ActionTypes.DELETE_QUICK_FILTER,
  quickFilterIdentifier,
});

export const selectQuickFilter = (quickFilterIdentifier) => ({
  type: ActionTypes.SELECT_QUICK_FILTER,
  quickFilterIdentifier,
});

export const showAddQuickFilterOption = () => ({
  type: ActionTypes.SHOW_ADD_QUICK_FILTER_OPTION,
});

export const cleanClickFilter = () => ({
  type: ActionTypes.CLEAN_QUICK_FILTER,
});
