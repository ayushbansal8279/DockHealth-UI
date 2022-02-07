import { getFiltersFromLocalStorage } from 'helpers/mega-filter-helper';
import * as ActionTypes from './action-types';

export function clearFiltersForMegaFilter() {
  return dispatch => {
    dispatch({ type: ActionTypes.CLEAR_MEGA_FILTERS });
  };
}

export function selectFiltersFromLocalStorage(id, status) {
  return dispatch => {
    const initialFilters = getFiltersFromLocalStorage(id, status);

    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters: initialFilters || {},
    });
  };
}

export function selectFiltersForMegaFilter(selectedFilters, id, status) {
  return dispatch => {
    if (!selectedFilters) {
      sessionStorage.removeItem(`filter-${id}-${status}`);
    } else {
      sessionStorage[`filter-${id}-${status}`] = JSON.stringify(
        selectedFilters,
      );
    }

    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters,
      id,
      status,
    });
  };
}

export const getQuickFilters = viewSpecificData => ({
  type: ActionTypes.GET_QUICK_FILTERS,
  viewSpecificData,
});

export const createQuickFilter = (name, viewSpecificData, selectedFilters) => {
  return {
    type: ActionTypes.CREATE_QUICK_FILTER,
    name,
    viewSpecificData,
    selectedFilters,
  };
};

export const updateQuickFilter = (
  identifier,
  dataToUpdate,
  viewSpecificData,
) => ({
  type: ActionTypes.UPDATE_QUICK_FILTER,
  dataToUpdate,
  identifier,
  viewSpecificData,
});

export const deleteQuickFilter = identifier => ({
  type: ActionTypes.DELETE_QUICK_FILTER,
  identifier,
});

export const selectQuickFilter = identifier => ({
  type: ActionTypes.SELECT_QUICK_FILTER,
  identifier,
});

export const showAddQuickFilterOption = () => ({
  type: ActionTypes.SHOW_ADD_QUICK_FILTER_OPTION,
});

export const cleanClickFilter = () => ({
  type: ActionTypes.CLEAN_QUICK_FILTER,
});
