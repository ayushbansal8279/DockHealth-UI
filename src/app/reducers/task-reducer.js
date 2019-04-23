import * as types from '../actions/action-types';
import initialState from './initialState';

const requestHistory = taskState => ({ ...taskState, isHistoryFetching: true });

const requestHistorySuccess = (taskState, { auditDetails }) => ({
  ...taskState,
  historyError: null,
  isHistoryFetching: false,
  currentTaskHistory: auditDetails,
});

const requestHistoryError = (taskState, { error }) => ({
  ...taskState,
  historyError: error,
  isHistoryFetching: false,
});

const clearHistory = taskState => ({ ...taskState, currentTaskHistory: null });

const updateDueDate = (taskState, { taskId, dueDate }) => ({
  ...taskState,
  tasks: taskState.tasks.map(task => (task.taskId === taskId ? ({ ...task, dueDate }) : task)),
});

const updatePatient = (taskState, { taskId, patient }) => ({
  ...taskState,
  tasks: taskState.tasks.map(task => (task.taskId === taskId ? ({ ...task, patient }) : task)),
});

const TaskReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.ADD_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return{
        ...state,
        // tasks: state.tasks.concat(action.task)
        tasks: [action.task].concat(state.tasks)
      }

    case types.DUPLICATE_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return{
        ...state,
        // tasks: state.tasks.concat(action.task)
        tasks: [action.duplicatedTask].concat(state.tasks)
      }

    case types.GET_TASKS_SUCCESS:
      // isFetching is used for the loading image
      return Object.assign({}, state, { tasks: action.tasks, isFetching:false });

    case types.GET_COMPLETED_TASKS_SUCCESS:
      return Object.assign({}, state, { completedTasks: action.tasks, isCompletedTasksFetching:false, showingCompletedTasks: true  });

    case types.REQUEST_TASKS:
      return Object.assign({}, state, { isFetching: true, tasks: [], completedTasks: [], showingCompletedTasks: false })

    case types.REQUEST_COMPLETED_TASKS:
      return Object.assign({}, state, { isCompletedTasksFetching: true })

    case types.REQUEST_HISTORY:
      return requestHistory(state, action);

    case types.HIDE_COMPLETED_TASKS:
      return Object.assign({}, state, { showingCompletedTasks: false, completedTasks: [] })

    case types.EDIT_TASK:
      return { ...state, task: action.task };

    // handling
    case types.MARK_TASK_STATUS_SUCCESS: // Tasks in 'incompletedTasks' state
      // This is the parent task Id (if subtask) or the actual task Id (if actual task is already top level)
      var mainTask
      if(action.task.parentTaskId){
        mainTask = action.task.parentTaskId
      }else{
        mainTask = action.task.taskId
      }

      return {
          ...state,
          // Loop through each of the top level tasks
          tasks: state.tasks.map(task =>
            // If 1: If the task Id is the same as the mainTask Id
            task.taskId === mainTask ?
              // Do this 1
              // If 2: If the task has a parentTaskId (is a subtask)
              action.task.parentTaskId ?
                // Loop through the subtasks
                {...task, subtasks:
                  task.subtasks.map(subtask =>
                    // If 3
                    subtask.taskId === action.task.taskId ?
                    {...subtask, status: action.status} :
                    // Else 3
                    subtask
                  )
                } :
              // Else 2: Else change the status of the task that is top level
              // If 4: If task is 'incomplete' and has subtasks
              action.status == 'COMPLETE' && action.task.subtasks.length > 0 ?
              {...task, status: action.status, subtasks:
                task.subtasks.map(subtask =>
                  subtask.status == 'INCOMPLETE' ?
                  {...subtask, status: action.status} :
                  subtask
                )
              } :
              { ...task, status: action.status }
            // Else 1: Else just return the task as is (it's not the one you're trying to change)
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

    // case types.DELETE_TASK_SUCCESS:
      //return Object.assign({}, state, { tasks: state.tasks.filter(task => task.taskId !== taskId)});
      // return {
      //   ...state,
      //   tasks: state.tasks.filter(task => task !== action.task)
      // };

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

    case types.DELETE_TASK_SUCCESS: {
      const mainTaskId = action.task.parentTaskId;

      if (mainTaskId) {
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.taskId === mainTaskId ?
              {...task, subtasks: task.subtasks.filter(({ taskId }) => taskId !== action.task.taskId)}
              : task
          )
        };
      }

      return {
        ...state,
        tasks: state.tasks.filter(({ taskId }) => taskId !== action.task.taskId)
      };
    }

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

    case types.UPDATE_TASK_DUE_DATE:
      return updateDueDate(state, action);

    case types.UPDATE_TASK_PATIENT:
      return updatePatient(state, action);

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

    // case types.ADD_TASK_SUCCESS:
    // return{
    //   ...state,
    //   tasks: [action.task].concat(state.tasks)
    // }

    case types.MOVE_TASK_SUCCESS: {
      const { task } = action;
      const isSubtask = Boolean(task.parentTaskId);

      if (!isSubtask) {
        return ({
          ...state,
          tasks: state.tasks.filter(t => t.taskId !== task.taskId),
        });
      }
      
      return ({
        ...state,
        tasks: state.tasks.map(t => t.taskId !== task.parentTaskId
          ? t
          : ({
            ...t,
            subtasks: t.subtasks.filter(subtask => subtask.taskId !== task.taskId),
          })),
      });
    }

    case types.UPDATE_TASK_SUCCESS: {
      const { task } = action;
      const mainTaskId = task.parentTaskId || task.taskId;

      const newState = {
        ...state,
        tasks: state.tasks.map(t => {
          if (t.taskId !== mainTaskId) {
            return t;
          }

          if (!task.parentTaskId) {
            return ({...t, ...task });
          }

          return ({
            ...t,
            read: false,
            subtasks: t.subtasks.map(subtask =>
              subtask.taskId === task.taskId
                ? {...subtask, ...task}
                : subtask),
          });
        }),
      };

      return newState;
    }

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
              {...subtask, assignedTo: action.task.assignedTo, assignedBy: action.task.assignedBy, assignmentUpdatedDateTime: action.task.assignmentUpdatedDateTime} :
              subtask
            )
          } :
          { ...task, assignedTo: action.task.assignedTo, assignedBy: action.task.assignedBy, assignmentUpdatedDateTime: action.task.assignmentUpdatedDateTime}
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
                    {...subtask, read:false, comments: [action.comment.data].concat(subtask.comments)} :
                    // {...subtask, read:false, comments: subtask.comments.concat([action.comment.data])} :
                    subtask
                  )
                } :
                { ...task, read:false, comments: [action.comment.data].concat(task.comments)}

                : task
            )
        };

    case types.UPDATE_TASK_COMMENT_SUCCESS:
      var mainTaskId
      if(action.task.parentTaskId){
        mainTaskId = action.task.parentTaskId
      }else{
        mainTaskId = action.task.taskId
      }
      return{
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTaskId ?
            action.task.parentTaskId ?
              {...task, subtasks:
                task.subtasks.map(subtask =>
                  subtask === action.task ?
                  {...subtask, comments:
                    subtask.comments.map(comment =>
                      comment === action.comment ?
                      {...comment, comment: comment} :
                      comment
                    )
                  } :
                  subtask
                )
              } :
              {...task, comments:
                task.comments.map(comment =>
                  comment === action.comment ?
                  {...comment, comment: comment} :
                  comment
                )
              } :
              task
            )
      };

      case types.DELETE_TASK_COMMENT_SUCCESS:
        var mainTaskId
        if(action.task.parentTaskId){
          mainTaskId = action.task.parentTaskId
        }else{
          mainTaskId = action.task.taskId
        }
        return{
          ...state,
          tasks: state.tasks.map(task =>
            task.taskId === mainTaskId ?
              action.task.parentTaskId ?
                {...task, subtasks:
                  task.subtasks.map(subtask =>
                    subtask === action.task ?
                    {...subtask, comments: subtask.comments.filter(comment => comment !== action.comment)} :
                    subtask
                  )
                } :
                {...task, comments: task.comments.filter(comment => comment !== action.comment)} :
                task
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
      return { ...state, selectedTaskId: action.taskId };

    case types.GET_TASK_HISTORY_SUCCESS:
      return requestHistorySuccess(state, action);

    case types.GET_TASK_HISTORY_ERROR:
      return requestHistoryError(state, action);

    case types.CLEAR_CURRENT_TASK_HISTORY:
      return clearHistory(state, action);

    case types.ORDER_SUB_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task => task.taskId === action.task.taskId ? action.task : task)
      };
    
  }

  return state;

  // return { hostnames: state.hostnames.filter(hostname =>
  //    hostname.id !== action.hostnameId
  // )}

}


export default TaskReducer
