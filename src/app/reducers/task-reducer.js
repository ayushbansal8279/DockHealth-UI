import * as types from '../actions/action-types';
import initialState from './initialState';

const TaskReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.ADD_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return{
        ...state,
        // tasks: state.tasks.concat(action.task)
        tasks: [action.task].concat(state.tasks)
      }

    case types.GET_TASKS_SUCCESS:
      return Object.assign({}, state, { tasks: action.tasks });

    case types.GET_COMPLETED_TASKS_SUCCESS:
      return Object.assign({}, state, { completedTasks: action.tasks });

    case types.EDIT_TASK:
      return { ...state, task: action.task };

    // handling
    case types.MARK_TASK_STATUS_SUCCESS: // Tasks in 'incompletedTasks' state
      var mainTask
      if(action.task.parentTaskId){
        mainTask = action.task.parentTaskId
      }else{
        mainTask = action.task.taskId
      }

      return {
          ...state,
          tasks: state.tasks.map(task =>
            task.taskId === mainTask ?
            action.task.parentTaskId ?
              {...task, subtasks:
                task.subtasks.map(subtask =>
                  subtask.taskId === action.task.taskId ?
                  {...subtask, status: action.status} :
                  subtask
                )
              } :
              { ...task, status: action.status }

              : task
          )
      };

      // handling
      case types.MARK_COMPLETE_TASK_STATUS_SUCCESS: // Tasks in 'completedTasks' state
        var mainTask
        if(action.task.parentTaskId){
          mainTask = action.task.parentTaskId
        }else{
          mainTask = action.task.taskId
        }

        return {
            ...state,
            completedTasks: state.completedTasks.map(task =>
              task.taskId === mainTask ?
              action.task.parentTaskId ?
                {...task, subtasks:
                  task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId ?
                    {...subtask, status: action.status} :
                    subtask
                  )
                } :
                { ...task, status: action.status }

                : task
            )
        };

    // ORIGINAL (doesn't deal with subtasks)
    // case types.MARK_COMPLETE_TASK_STATUS_SUCCESS: // Tasks in 'completedTasks' state
    //
    // 	return {
    //     ...state,
    //     completedTasks: state.completedTasks.map(task =>
    //       task.taskId === action.task.taskId ?
    //         // transform the one with a matching id
    //         { ...task, status: action.status } :
    //         // otherwise return original task
    //         task
    //     )
    //   };

    case types.DELETE_TASK_SUCCESS:
      //return Object.assign({}, state, { tasks: state.tasks.filter(task => task.taskId !== taskId)});
      return {
        ...state,
        tasks: state.tasks.filter(task => task !== action.task)
      };

    // case types.DELETE_TASK_SUCCESS:
    // var mainTask
    // if(action.task.parentTaskId){
    // mainTask = action.task.parentTaskId
    // }else{
    // mainTask = action.task.taskId
    // }
    //
    // return {
    //   ...state,
    //   tasks: state.tasks.filter(task =>
    //     task.taskId === mainTask ?
    //     action.task.parentTaskId ?
    //       {...task, subtasks:
    //         task.subtasks.filter(subtask =>
    //           subtask.taskId === action.task.taskId ?
    //           (subtask => subtask.taskId !== mainTask) :
    //           subtask
    //         )
    //       } :
    //       (task => task.taskId !== mainTask)
    //       : task
    //   )
    // };

    // case types.DELETE_TASK_SUCCESS:
    // var mainTask
    // if(action.task.parentTaskId){
    //   mainTask = action.task.parentTaskId
    // }else{
    //   mainTask = action.task.taskId
    // }
    //
    // return {
    //     ...state,
    //     tasks: state.tasks.map(task =>
    //       task.taskId === mainTask ?
    //       action.task.parentTaskId ?
    //         {...task, subtasks: task.subtasks.filter(subtask => subtask.taskId !== mainTask)} :
    //         { ...task, tasks: state.tasks.filter(task => task.taskId !== taskId) }
    //
    //         : task
    //     )
    // };

    // case types.UPDATE_TASK_DESCRIPTION_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.filter(task => task.taskId !== taskId)
    //   };

    // case types.UPDATE_TASK_DESCRIPTION_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.map(task =>
    //       task.taskId === action.taskId ?
    //         // transform the one with a matching id
    //         { ...task, description: action.description } :
    //         // otherwise return original task
    //         task
    //     )
    //   };

    case types.UPDATE_TASK_DESCRIPTION_SUCCESS:
    var mainTask
    if(action.task.parentTaskId){
    mainTask = action.task.parentTaskId
    }else{
    mainTask = action.task.taskId
    }

    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.taskId === mainTask ?
          action.task.parentTaskId ?
          {...task, read:false, subtasks:
            task.subtasks.map(subtask =>
              subtask.taskId === action.task.taskId ?
              {...subtask, read:false, description: action.description} :
              subtask
            )
          } :
          { ...task, read:false, description: action.description }
          : task
      )
    };

    // case types.UPDATE_TASK_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.map(task =>
    //       task.taskId === action.task.taskId ?
    //         // transform the one with a matching id
    //         {...task, ...action.task } :
    //         // otherwise return original task
    //         task
    //     )
    //   };

    case types.UPDATE_TASK_SUCCESS:
    var mainTask
    if(action.task.parentTaskId){
    mainTask = action.task.parentTaskId
    }else{
    mainTask = action.task.taskId
    }

    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.taskId === mainTask ?
          action.task.parentTaskId ?
          {...task, read:false, subtasks:
            task.subtasks.map(subtask =>
              subtask.taskId === action.task.taskId ?
              {...subtask, ...action.task} :
              subtask
            )
          } :
          { ...task, ...action.task}
          : task
      )
    };

      case types.TOGGLE_TASK_PRIORITY_SUCCESS:
      var mainTask
      if(action.task.parentTaskId){
      mainTask = action.task.parentTaskId
      }else{
      mainTask = action.task.taskId
      }

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTask ?
          action.task.parentTaskId ?
            {...task, subtasks:
              task.subtasks.map(subtask =>
                subtask.taskId === action.task.taskId ?
                {...subtask, priority: action.priority} :
                subtask
              )
            } :
            { ...task, priority: action.priority }
            : task
        )
      };

    // case types.TOGGLE_TASK_PRIORITY_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.map(task =>
    //       task.taskId === action.taskId ?
    //         // transform the one with a matching id
    //         { ...task, priority: action.priority } :
    //         // otherwise return original task
    //         task
    //   )
    // };

    case types.ASSIGN_OR_REASSIGN_TASK_SUCCESS:
    var mainTask
    if(action.task.parentTaskId){
    mainTask = action.task.parentTaskId
    }else{
    mainTask = action.task.taskId
    }

    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.taskId === mainTask ?
        action.task.parentTaskId ?
          {...task, subtasks:
            task.subtasks.map(subtask =>
              subtask.taskId === action.task.taskId ?
              {...subtask, assignedTo: action.member} :
              subtask
            )
          } :
          { ...task, assignedTo: action.member}
          : task
      )
    };

    // case types.ASSIGN_OR_REASSIGN_TASK_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.map(task =>
    //       task === action.task ?
    //         // transform the one with a matching id
    //         { ...task, assignedTo: action.member } :
    //         // otherwise return original task
    //         task
    //     )
    //   };

      case types.ADD_TASK_COMMENT_SUCCESS:
        var mainTask
        if(action.task.parentTaskId){
          mainTask = action.task.parentTaskId
        }else{
          mainTask = action.task.taskId
        }

        return {
            ...state,
            tasks: state.tasks.map(task =>
              task.taskId === mainTask ?
              action.task.parentTaskId ?
                {...task, read:false, subtasks:
                  task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId ?
                    {...subtask, read:false, comments: subtask.comments.concat([action.comment.data])} :
                    subtask
                  )
                } :
                { ...task, read:false, comments: task.comments.concat([action.comment.data]) }

                : task
            )
        };

    // case types.ADD_TASK_COMMENT_SUCCESS:
    //   return {
    //     ...state,
    //     tasks: state.tasks.map(task =>
    //       task.taskId === action.task.taskId ?
    //         // transform the one with a matching id
    //         { ...task, comments: task.comments.concat([action.comment.data]) } :
    //         // otherwise return original task
    //         task
    //     )
    //   };

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
        var mainTask
        if(action.task.parentTaskId){
          mainTask = action.task.parentTaskId
        }else{
          mainTask = action.task.taskId
        }

        return {
            ...state,
            tasks: state.tasks.map(task =>
              task.taskId === mainTask ?
              action.task.parentTaskId ?
                {...task, subtasks:
                  task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId ?
                    {...subtask, read: !action.task.read} :
                    subtask
                  )
                } :
                { ...task, read: !action.task.read }

                : task
            )
        };

    case types.SET_AS_CURRENT_TASK:
      var currentTaskVar = {}
      state.tasks.map(task =>
        task.taskId == action.taskId ?
        currentTaskVar = task : task
      )
      // currentListVar
      return { ...state, currentTask:currentTaskVar };
      break


  }

  return state;

  // return { hostnames: state.hostnames.filter(hostname =>
  //    hostname.id !== action.hostnameId
  // )}

}


export default TaskReducer
