/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';
import * as MegaFilterApi from 'api/mega-filter-api';
import * as ActionTypes from './action-types';

const getFiltersFromLocalStorage = identifier =>
  sessionStorage[`filter-${identifier}`]
    ? JSON.parse(sessionStorage[`filter-${identifier}`])
    : null;

export function getFiltersForMegaFilter(listId) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForMegaFilter(listId)
      .then(data => {
        const initialFilters = getFiltersFromLocalStorage(listId);

        if (initialFilters)
          dispatch({
            type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
            selectedFilters: initialFilters,
          });

        dispatch({
          type: ActionTypes.FETCH_MEGA_FILTERS_SUCCESS,
          filters: data,
        });

        dispatch({
          type: ActionTypes.INITIALIZE_MEGA_FILTER,
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_FAILURE, error });
      });
  };
}

export function selectFiltersForMegaFilter(selectedFilters, listId) {
  return dispatch => {
    if (isEmpty(selectedFilters)) {
      sessionStorage.removeItem(`filter-${listId}`);
    } else {
      sessionStorage[`filter-${listId}`] = JSON.stringify(selectedFilters);
    }

    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters,
    });
  };
}

export function clearFiltersForMegaFilter() {
  return dispatch => {
    dispatch({ type: ActionTypes.CLEAR_MEGA_FILTERS });
  };
}
