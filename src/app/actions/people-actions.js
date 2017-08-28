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

export function loading(){
  return function(dispatch){
    dispatch({type: ActionTypes.REQUEST_PEOPLE})
  }
}

export function invitePersonToOrganization(formProps ){
    var personInfo = {email : formProps.email,
                    firstName:formProps.firstName,
                    lastName:formProps.lastName
                  }

    return function(dispatch) {
      return PeopleApi.invitePersonToOrganization(personInfo).then(res => {
        dispatch({type: ActionTypes.INVITEPERSON_ORG_SUCCESS, res});
        toggleAlert("Invitation sent!", "success")
      }).catch(error => {
        //console.log(error.message);
        throw(error);
      });
    };
  }

  export function resendInviteToOrganization(email){
      var personInfo = {email : email,
                      organizationId:'1',
                    }
      return function(dispatch) {
        return PeopleApi.resendInviteToOrganization(personInfo).then(res => {
          dispatch({type: ActionTypes.INVITEPERSON_ORG_SUCCESS, res});
          toggleAlert("Invitation resent!", "success")
        }).catch(error => {
          //console.log(error.message);
          throw(error);
        });
      };
    }

  export function changeUserRoleForOrg(markedUserId,role) {
    return function(dispatch) {
      return PeopleApi.changeUserRoleForOrg(markedUserId,role).then(res => {
        dispatch({type: ActionTypes.CHANGEUSERROLE_ORG_SUCCESS, res});
      }).catch(error => {
        throw(error);
      });
    };
  }

  export function cancelInviteToOrganization(markedUserEmail) {
    return function(dispatch) {
      return PeopleApi.cancelInviteToOrganization(markedUserEmail).then(res => {
        dispatch({type: ActionTypes.CANCEL_USER_ORG_INVITE_SUCCESS, res});
      }).catch(error => {
        throw(error);
      });
    };
  }

  export function removeUserFromOrganization(removedUserId) {
    return function(dispatch) {
      return PeopleApi.removeUserFromOrganization(removedUserId).then(res => {
        dispatch({type: ActionTypes.REMOVE_USER_ORG_SUCCESS, res});
        toggleAlert("User removed successfully")
      }).catch(error => {
        throw(error);
      });
    };
  }

  export function getUserById(userId) {
    return function(dispatch) {
      return PeopleApi.getUserById(parseInt(userId)).then(user => {
        dispatch({type: ActionTypes.GET_USER_DETAILS_SUCCESS, user, userId});
      }).catch(error => {
        throw(error);
      });
    };
  }

  export function getUserAvatar(user) {
    return function(dispatch) {
      return PeopleApi.getUserAvatar(user).then(res => {
        dispatch({type: ActionTypes.GET_USER_AVATAR_SUCCESS, user});
      }).catch(error => {
        throw(error);
      });
    };
  }
