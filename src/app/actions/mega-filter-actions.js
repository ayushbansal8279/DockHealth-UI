/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';
import { getFiltersFromLocalStorage } from 'helpers/mega-filter-helper';
import * as MegaFilterApi from 'api/mega-filter-api';
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
      selectedFilters: initialFilters || [],
    });
  };
}

export function getFiltersForMegaFilter(listId, status) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForTaskListMegaFilter(listId, status)
      .then(data => {
        dispatch(selectFiltersFromLocalStorage(listId, status));
        dispatch({
          type: ActionTypes.FETCH_MEGA_FILTERS_SUCCESS,
          filters: data,
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_FAILURE, error });
      });
  };
}

export function getFiltersForPeopleListMegaFilter(userId, status) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForPeopleListMegaFilter(userId, status)
      .then(data => {
        dispatch(selectFiltersFromLocalStorage(userId, status));
        dispatch({
          type: ActionTypes.FETCH_MEGA_FILTERS_SUCCESS,
          filters: data,
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_FAILURE, error });
      });
  };
}

export function selectFiltersForMegaFilter(selectedFilters, id, status) {
  return dispatch => {
    if (isEmpty(selectedFilters)) {
      sessionStorage.removeItem(`filter-${id}-${status}`);
    } else {
      sessionStorage[`filter-${id}-${status}`] = JSON.stringify(
        selectedFilters,
      );
    }

    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters,
    });
  };
}
