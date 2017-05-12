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


export function invitePersonToOrganization(formProps ){
    var personInfo = {email : formProps.email,
                    firstName:formProps.firstName,
                    lastName:formProps.lastName
                  }

    return function(dispatch) {
      return PeopleApi.invitePersonToOrganization(personInfo).then(res => {
        dispatch({type: ActionTypes.INVITEPERSON_ORG_SUCCESS, res});
      }).catch(error => {
        //console.log(error.message);
        throw(error);
        //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
      });
    };
  }
