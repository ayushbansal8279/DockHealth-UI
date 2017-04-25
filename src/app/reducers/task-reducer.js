import * as types from '../actions/action-types';
import initialState from './initialState';

const TaskReducer = function(state = {tasks: []}, action) {

  switch(action.type) {    

    case types.ADD_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return Object.assign({}, state, {tasks: state.tasks.concat([action.task])});

    case types.GET_TASKS_SUCCESS:
      return Object.assign({}, state, { tasks: action.tasks });

    // handling
    case types.MARK_TASK_STATUS_SUCCESS:
    	return {
          ...state,
          tasks: state.tasks.map(task =>
            task.taskId === action.taskId ?
              // transform the one with a matching id
              { ...task, status: action.status } : 
              // otherwise return original task
              task
          ) 
      };

    case types.DELETE_TASK_SUCCESS:
      const taskId = action.taskId;
      //return Object.assign({}, state, { tasks: state.tasks.filter(task => task.taskId !== taskId)});
      return {
          ...state,
          tasks: state.tasks.filter(task => task.taskId !== taskId)
        };
  }

  return state;

  // return { hostnames: state.hostnames.filter(hostname =>
  //    hostname.id !== action.hostnameId
  // )}

}


export default TaskReducer
