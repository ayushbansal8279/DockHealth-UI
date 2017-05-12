import * as types from '../actions/action-types';
import initialState from './initialState';

const PeopleReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.GET_PEOPLE_SUCCESS:
      return {...state, peoplelist:action.peoplelist};  //whatever our current state is, add on "peoplelist"
  }
  return state;
}

export default PeopleReducer
