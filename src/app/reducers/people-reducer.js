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

    case types.GET_USER_DETAILS_SUCCESS:
      // state.users[action.userId] = {"user":action.user}
      return {...state, users: state.users.concat({
        ["user"]: action.user
      })};
  }

  // const reducer = (state = {}, {type, compositeKey, connection}) => {
  //   switch (type) {
  //     case 'addConnection':
  //       return Object.assign({}, state, {
  //         connections: state.connections.concat({
  //           [compositeKey]: connection
  //         })
  //       });
  //     default:
  //       return state;
  //   }
  // }

  return state;
}

export default PeopleReducer
