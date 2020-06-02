/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';
import * as MegaFilterApi from 'api/mega-filter-api';
import * as ActionTypes from './action-types';

const getFiltersFromLocalStorage = identifier =>
  sessionStorage[`filter-${identifier}`]
    ? JSON.parse(sessionStorage[`filter-${identifier}`])
    : null;

const handleFiltersLoadSuccess = (id, data, dispatch) => {
  const initialFilters = getFiltersFromLocalStorage(id);

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
};

export function getFiltersForMegaFilter(listId, status, isInitial = true) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForTaskListMegaFilter(listId, status)
      .then(data => {
        if (isInitial) {
          handleFiltersLoadSuccess(listId, data, dispatch);
        } else {
          dispatch({
            type: ActionTypes.FETCH_MEGA_FILTERS_SUCCESS,
            filters: data,
          });
        }
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_FAILURE, error });
      });
  };
}

export function getFiltersForPeopleListMegaFilter(
  userId,
  status,
  isInitial = true,
) {
  return dispatch => {
    dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_REQUEST });

    MegaFilterApi.getFiltersForPeopleListMegaFilter(userId, status)
      .then(data => {
        if (isInitial) {
          handleFiltersLoadSuccess(userId, data, dispatch);
        } else {
          dispatch({
            type: ActionTypes.FETCH_MEGA_FILTERS_SUCCESS,
            filters: data,
          });
        }
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_MEGA_FILTERS_FAILURE, error });
      });
  };
}

export function selectFiltersForMegaFilter(selectedFilters, id) {
  return dispatch => {
    if (isEmpty(selectedFilters)) {
      sessionStorage.removeItem(`filter-${id}`);
    } else {
      sessionStorage[`filter-${id}`] = JSON.stringify(selectedFilters);
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
