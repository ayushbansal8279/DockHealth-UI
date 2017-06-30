import * as types from '../actions/action-types';
import initialState from './initialState';

const TaskListReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.ADD_TASKLIST_SUCCESS:
      return {...state, tasklist: [action.tasklist].concat(state.tasklist)}

    case types.GET_TASKLIST_SUCCESS:
      return {...state, tasklist:action.tasklist};  //whatever our current state is, add on "tasklist"

    case types.GET_PENDING_TASKLIST_SUCCESS:
      return {...state, pendingTasklists:action.tasklist};  //whatever our current state is, add on "tasklist"

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

    case types.GET_AUDITS_BY_TASKLIST_SUCCESS:
      return {...state, tasklistaudits:action.audits};  //whatever our current state is, add on "audits"

    case types.GET_AUDITS_BY_ALLUSERLIST_SUCCESS:
      return {...state, auditsForAllUserList:action.auditsForAllUserList};  //whatever our current state is, add on "auditsForAllUserList"

    case types.TOGGLE_LIST_NOTIFICATIONS_SUCCESS:
      return {...state, tasklistone:{notifications:action.receiveNotifications}};

    case types.UPDATE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: state.tasklist.map(taskList =>
          taskList.taskListId === action.updatedTasklist.taskListId ?
            {...taskList, ...action.updatedTasklist} :
            taskList
          )
        };

    case types.DELETE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: state.tasklist.filter(taskList => taskList.taskListId !== action.taskListId)
      }

    case types.SET_AS_CURRENT_LIST:
      var currentListVar = {}
      state.tasklist.map(taskList =>
        taskList.taskListId.toString() == action.taskListId ?
        currentListVar = taskList : taskList
      )
      // currentListVar
      return { ...state, currentList:currentListVar };
      break

    // case types.SET_AS_CURRENT_LIST:
    //   var currentListvar = {}
    //   {...state, currentList:
    //   // currentList:action.taskListId};
    //   tasklist: state.tasklist.map(taskList =>
    //     taskList.taskListId.toString() === action.taskListId ?
    //     {...state, currenList:taskList} :
    //
    //     )
    //   }


    // case types.ADD_TASKLIST_FAILURE:
    //   //whatever our current state is, add on "tasklist"
    //   return {...state, addtasklisterror:action.errorMessage} ;

  }
  return state;
}

export default TaskListReducer
