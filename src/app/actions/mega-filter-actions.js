/* eslint-disable import/prefer-default-export */
import * as MegaFilterApi from 'api/mega-filter-api';
import * as ActionTypes from './action-types';

export function getFiltersForMegaFilter(listId) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForMegaFilter(listId)
      .then(data => {
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

export function selectFiltersForMegaFilter(selectedFilters) {
  return dispatch => {
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
