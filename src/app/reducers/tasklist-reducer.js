import * as types from '../actions/action-types';
import initialState from './initialState';

const TaskListReducer = function(state = initialState, action) {

  switch(action.type) {
    //
    // case types.ADD_TASK_SUCCESS:
    //   // with concact make a copy of the array, and then we'll change and return the copy
    //   return Object.assign({}, state, {tasks: state.tasks.concat([action.task])});

    case types.GET_TASKLIST_SUCCESS:
      //whatever our current state is, add on "tasklist"
      return {...state, tasklist:action.tasklist} ;
  }
  return state;
}

export default TaskListReducer
