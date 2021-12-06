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
