/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';
import * as MegaFilterApi from 'api/mega-filter-api';
import * as ActionTypes from './action-types';

export function clearFiltersForMegaFilter() {
  return dispatch => {
    dispatch({ type: ActionTypes.CLEAR_MEGA_FILTERS });
  };
}

const getFiltersFromLocalStorage = (identifier, status) =>
  sessionStorage[`filter-${identifier}-${status}`]
    ? JSON.parse(sessionStorage[`filter-${identifier}-${status}`])
    : null;

const handleFiltersLoadSuccess = (id, status, data, dispatch) => {
  const initialFilters = getFiltersFromLocalStorage(id, status);

  if (initialFilters)
    dispatch({
      type: ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
      selectedFilters: initialFilters,
    });
  else {
    dispatch(clearFiltersForMegaFilter());
  }

  dispatch({
    type: ActionTypes.FETCH_MEGA_FILTERS_SUCCESS,
    filters: data,
  });

  dispatch({
    type: ActionTypes.INITIALIZE_MEGA_FILTER,
  });
};

export function getFiltersForMegaFilter(listId, status) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForTaskListMegaFilter(listId, status)
      .then(data => {
        handleFiltersLoadSuccess(listId, status, data, dispatch);
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
        handleFiltersLoadSuccess(userId, status, data, dispatch);
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
