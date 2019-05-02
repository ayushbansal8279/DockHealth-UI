import * as types from '../actions/action-types';
import initialState from './initialState';

const inviteUser = (state, { userId }) => ({
  ...state,
  tasklistmembers: [
    ...state.tasklistmembers,
    ...state.orgusersnotintasklist.filter(user => user.userId == userId)
      .map(user => ({ ...user, status: 'PENDING', taskListUserRole: 'MEMBER' })),
  ],
  orgusersnotintasklist: state.orgusersnotintasklist.filter(user => user.userId != userId),
});

const inviteMultipleUsers = (state, { invitedUsers }) => ({
  ...state,
  tasklistmembers: [
    ...state.tasklistmembers,
    ...state.orgusersnotintasklist
      .filter(user => invitedUsers.some(userId => user.userId == userId))
      .map(user => ({ ...user, status: 'PENDING', taskListUserRole: 'MEMBER' })),
  ],
  orgusersnotintasklist: state.orgusersnotintasklist
    .filter(user => invitedUsers.every(userId => user.userId != userId)),
});

const TaskListReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.INVITE_USER_TO_TASKLIST_SUCCESS:
      return inviteUser(state, action);

    case types.INVITEMULUSERS_TASKLIST_SUCCESS:
      return inviteMultipleUsers(state, action);

    case types.ADD_TASKLIST_SUCCESS:
      return {...state, tasklist: [action.tasklist].concat(state.tasklist), currentList:action.tasklist}

    case types.REQUEST_LISTS:
      return Object.assign({}, state, {isFetching:true})

    case types.ACCEPT_INVITE_TOTASKLIST_SUCCESS:
      return {...state, tasklist: [action.tasklist].concat(state.tasklist)}

    case types.GET_TASKLIST_SUCCESS:
      return {...state, tasklist:action.tasklist, isFetching: false};  //whatever our current state is, add on "tasklist"

    case types.SET_CURRENT_LIST:
      return {...state, currentList: action.currentList};  //whatever our current state is, add on "currentList"

    case types.GET_TASKLISTMEMBERS_SUCCESS:
      var listMembersDetails = {}
      listMembersDetails.taskListId = action.taskListId
      listMembersDetails.tasklistmembers = action.tasklistmembers
      var currentTaskListMembersDetails = state.allTaskListMembers.filter(details => details.taskListId == action.taskListId)
      if(!currentTaskListMembersDetails || currentTaskListMembersDetails.length==0){
        return {...state, tasklistmembers: action.tasklistmembers, 
          allTaskListMembers: [listMembersDetails].concat(state.allTaskListMembers)
        };
      }else{
        return {...state, tasklistmembers: action.tasklistmembers, 
        allTaskListMembers: state.allTaskListMembers.map(listMembers =>
          listMembers.taskListId === action.taskListId ?
          {...listMembers, listMembersDetails} : listMembers
        )};
      }
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

    case types.GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS:
      return {...state, activityFeedForAllUserList:action.activityFeedForAllUserList};  //whatever our current state is, add on "activityFeedForAllUserList"

    case types.TOGGLE_LIST_NOTIFICATIONS_SUCCESS:
      return {...state, currentList:{notifications:action.receiveNotifications}};

    case types.SET_GENERIC_LIST_COUNTS:
      return {...state, genericLists:action.lists};

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

    case types.IS_LIST:
      return {
        ...state,
        isList: action.boolean
      }

    case types.REMOVEUSER_TASKLIST_SUCCESS:
        return {
          ...state,
          tasklistmembers: state.tasklistmembers.filter(member => member.userId !== action.removedUser.userId)
        }

    case types.CHANGEUSERROLE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklistmembers: state.tasklistmembers.map(member =>
          member === action.markedUser ?
          {...member, taskListUserRole:action.role} : member
        )
      }

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
