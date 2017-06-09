import * as types from '../actions/action-types';
import initialState from './initialState';

const TaskReducer = function(state = {tasks: [], completedTasks: []}, action) {

  switch(action.type) {

    case types.ADD_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return{
        ...state,
        tasks: state.tasks.concat(action.task)
      }

    case types.GET_TASKS_SUCCESS:
      return Object.assign({}, state, { tasks: action.tasks });

    case types.GET_COMPLETED_TASKS_SUCCESS:
      return Object.assign({}, state, { completedTasks: action.tasks });

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
          ).filter(task => task.taskId !== taskId)
      };

    case types.MARK_COMPLETED_TASK_STATUS_SUCCESS:
      return {
          ...state,
          completedTasks: state.tasks.map(task =>
            task.taskId === action.taskId ?
              // transform the one with a matching id
              { ...task, status: action.status } :
              // otherwise return original task
              task
          ).filter(task => task.taskId !== taskId)
      };

    case types.DELETE_TASK_SUCCESS:
      const taskId = action.taskId;
      //return Object.assign({}, state, { tasks: state.tasks.filter(task => task.taskId !== taskId)});
      return {
        ...state,
        tasks: state.tasks.filter(task => task.taskId !== taskId)
      };

    // case types.UPDATE_TASK_DESCRIPTION_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.filter(task => task.taskId !== taskId)
    //   };

    case types.UPDATE_TASK_DESCRIPTION_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId ?
            // transform the one with a matching id
            { ...task, description: action.description } :
            // otherwise return original task
            task
        )
      };

    case types.TOGGLE_TASK_PRIORITY_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId ?
            // transform the one with a matching id
            { ...task, priority: action.priority } :
            // otherwise return original task
            task
      )
    };

    case types.ASSIGN_OR_REASSIGN_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId ?
            // transform the one with a matching id
            { ...task, assignedTo: action.member } :
            // otherwise return original task
            task
        )
      };

    case types.ADD_TASK_COMMENT_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId ?
            // transform the one with a matching id
            { ...task, comments: task.comments.concat([action.comment.data]) } :
            // otherwise return original task
            task
        )
      };

    case types.ADD_PATIENT_TO_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId ?
            // transform the one with a matching id
            { ...task, patient: action.patient } :
            // otherwise return original task
            task
        )
      };

    case types.FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task === action.task ?
            // transform the one with a matching id
            { ...task, read: !action.task.read } :
            // otherwise return original task
            task
        )
      }
  }

  return state;

  // return { hostnames: state.hostnames.filter(hostname =>
  //    hostname.id !== action.hostnameId
  // )}

}


export default TaskReducer
