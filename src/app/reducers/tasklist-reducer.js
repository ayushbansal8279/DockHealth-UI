import * as types from '../actions/action-types';
import initialState from './initialState';

const TaskListReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.GET_TASKLIST_SUCCESS:
      return {...state, tasklist:action.tasklist};  //whatever our current state is, add on "tasklist"

    case types.GET_TASKLIST_ONE_SUCCESS:
      return {...state, tasklistone:action.tasklistone};  //whatever our current state is, add on "tasklistone"

    case types.GET_TASKLISTMEMBERS_SUCCESS:
      return {...state, tasklistmembers:action.tasklistmembers};  //whatever our current state is, add on "tasklistmembers"

    case types.GET_ORGUSERSNOTINTASKLIST_SUCCESS:
      return {...state, orgusersnotintasklist:action.users};  //whatever our current state is, add on "orgusersnotintasklist"

    case types.GET_NONORGUSERSINTASKLIST_SUCCESS:
        return {...state, nonorgusersintasklist:action.users};  //whatever our current state is, add on "nonorgusersintasklist"

    case types.GET_TASKLISTACTIVEMEMBERS_SUCCESS:
      return {...state, tasklistactivemembers:action.tasklistactivemembers};  //whatever our current state is, add on "tasklistactivemembers"


    // case types.UPDATE_TASKLIST_SUCCESS:
    //   return {...state, updtasklist:action.updtasklist};  //whatever our current state is, add on "onetasklist"


    // case types.ADD_TASKLIST_FAILURE:
    //   //whatever our current state is, add on "tasklist"
    //   return {...state, addtasklisterror:action.errorMessage} ;

  }
  return state;
}

export default TaskListReducer
