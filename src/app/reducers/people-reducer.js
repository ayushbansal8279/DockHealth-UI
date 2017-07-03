import * as types from '../actions/action-types';
import initialState from './initialState';

const PeopleReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.GET_PEOPLE_SUCCESS:
      return {...state, peoplelist:action.peoplelist};  //whatever our current state is, add on "peoplelist"
    // case types.INVITEPERSON_ORG_SUCCESS:
    //   var invitedPerson = {}
    //   invitedPerson.firstName = action.res.firstName
    //   invitedPerson.lastName = action.res.lastName
    //   invitedPerson.email = action.res.email
    //   invitedPerson.userInviteStatus = "PENDING"
    //   invitedPerson.orgUserRole = "MEMBER"
    //   return{
    //     ...state,
    //     peoplelist: [invitedPerson].concat(state.peoplelist)
    //   }
  }
  return state;
}

export default PeopleReducer
