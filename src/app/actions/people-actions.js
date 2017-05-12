import * as ActionTypes from './action-types';
import * as PeopleApi from '../api/people-api';

export function findAllUsersByOrganizationId() {
  return function(dispatch) {
    return PeopleApi.findAllUsersByOrganizationId().then(peoplelist => {
      dispatch({type: ActionTypes.GET_PEOPLE_SUCCESS, peoplelist});
    }).catch(error => {
      throw(error);
    });
  };
}
