import { lensProp, map, propEq, set, when, pickBy, isNil } from 'ramda';

import {
  ACCEPT_INVITE_TOTASKLIST_SUCCESS,
  ADD_TASKLIST_SUCCESS,
  CHANGEUSERROLE_TASKLIST_SUCCESS,
  DELETE_TASKLIST_SUCCESS,
  GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS,
  GET_AUDITS_BY_ALLUSERLIST_SUCCESS,
  GET_AUDITS_BY_TASKLIST_SUCCESS,
  GET_NONORGUSERSINTASKLIST_SUCCESS,
  GET_ORGUSERSNOTINTASKLIST_SUCCESS,
  GET_TASKLIST_STATS_FAILURE,
  GET_TASKLIST_STATS_SUCCESS,
  GET_TASKLIST_SUCCESS,
  GET_TASKLISTACTIVEMEMBERS_SUCCESS,
  GET_TASKLISTMEMBERS_SUCCESS,
  INVITE_USER_TO_TASKLIST_SUCCESS,
  INVITEMULUSERS_TASKLIST_SUCCESS,
  IS_LIST,
  REMOVEUSER_TASKLIST_SUCCESS,
  REQUEST_LISTS,
  RESET_TASKLIST_STATS,
  SET_AS_CURRENT_LIST,
  SET_CURRENT_LIST,
  SET_GENERIC_LIST_COUNTS,
  TOGGLE_LIST_NOTIFICATIONS_SUCCESS,
  UPDATE_TASKLIST_SUCCESS,
} from '../actions/action-types';

const initialState = {
  tasklist: [],
  tasklistmembers: [],
  allTaskListMembers: [],
  orgusersnotintasklist: [],
  nonorgusersintasklist: [],
  tasklistactivemembers: [],
  tasklistaudits: [],
  auditsForAllUserList: [],
  activityFeedForAllUserList: [],
  currentList: {},
  genericLists: [],
  isFetching: false,
  isList: false,
  taskListStats: null,
  taskListStatsOk: null,
};

const DEFAULT_USER_STATUS = 'PENDING';
const DEFAULT_USER_ROLE = 'MEMBER';

const inviteUserMapper = user => ({
  ...user,
  status: DEFAULT_USER_STATUS,
  taskListUserRole: DEFAULT_USER_ROLE,
});

const inviteUser = (state, { userId }) => ({
  ...state,
  tasklistmembers: [
    ...state.tasklistmembers,
    ...state.orgusersnotintasklist
      .filter(user => user.userId === userId)
      .map(inviteUserMapper),
  ],
  orgusersnotintasklist: state.orgusersnotintasklist.filter(
    user => user.userId !== userId,
  ),
});

const inviteMultipleUsers = (state, { invitedUsers }) => ({
  ...state,
  tasklistmembers: [
    ...state.tasklistmembers,
    ...state.orgusersnotintasklist
      .filter(user => invitedUsers.some(userId => user.userId === userId))
      .map(inviteUserMapper),
  ],
  orgusersnotintasklist: state.orgusersnotintasklist.filter(user =>
    invitedUsers.every(userId => user.userId !== userId),
  ),
});

const TaskListReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVITE_USER_TO_TASKLIST_SUCCESS:
      return inviteUser(state, action);

    case INVITEMULUSERS_TASKLIST_SUCCESS:
      return inviteMultipleUsers(state, action);

    case ADD_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: [action.tasklist].concat(state.tasklist),
        currentList: action.tasklist,
      };

    case REQUEST_LISTS:
      return { ...state, isFetching: true };

    case ACCEPT_INVITE_TOTASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: [action.tasklist].concat(state.tasklist),
      };

    case GET_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: action.tasklist,
        isFetching: false,
      };

    case SET_CURRENT_LIST:
      return {
        ...state,
        currentList: action.currentList,
      };

    case GET_TASKLISTMEMBERS_SUCCESS: {
      const { taskListId, tasklistmembers } = action;

      const listMembersDetails = {
        taskListId,
        tasklistmembers,
      };

      const currentTaskListMembersDetails = state.allTaskListMembers.filter(
        details => details.taskListId === action.taskListId,
      );

      if (
        !currentTaskListMembersDetails ||
        currentTaskListMembersDetails.length === 0
      ) {
        return {
          ...state,
          tasklistmembers,
          allTaskListMembers: [listMembersDetails].concat(
            state.allTaskListMembers,
          ),
        };
      }

      return {
        ...state,
        tasklistmembers,
        allTaskListMembers: state.allTaskListMembers.map(listMembers =>
          listMembers.taskListId === action.taskListId
            ? { ...listMembers, listMembersDetails }
            : listMembers,
        ),
      };
    }

    case GET_ORGUSERSNOTINTASKLIST_SUCCESS:
      return {
        ...state,
        orgusersnotintasklist: action.users,
      };

    case GET_NONORGUSERSINTASKLIST_SUCCESS:
      return {
        ...state,
        nonorgusersintasklist: action.users,
      };

    case GET_TASKLISTACTIVEMEMBERS_SUCCESS:
      return {
        ...state,
        tasklistactivemembers: action.tasklistactivemembers,
      };

    case GET_AUDITS_BY_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklistaudits: action.audits,
      };

    case GET_AUDITS_BY_ALLUSERLIST_SUCCESS:
      return {
        ...state,
        auditsForAllUserList: action.auditsForAllUserList,
      };

    case GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS:
      return {
        ...state,
        activityFeedForAllUserList: action.activityFeedForAllUserList,
      };

    case TOGGLE_LIST_NOTIFICATIONS_SUCCESS: {
      const { taskListId, receiveNotifications } = action;

      const updateTasklist = map(
        when(
          propEq('taskListId', taskListId),
          set(lensProp('notifications'), receiveNotifications),
        ),
      );

      return {
        ...state,
        tasklist: updateTasklist(state.tasklist),
        currentList: { notifications: receiveNotifications },
      };
    }

    case SET_GENERIC_LIST_COUNTS:
      return {
        ...state,
        genericLists: action.lists,
      };

    case UPDATE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: state.tasklist.map(taskList =>
          taskList.taskListId === action.updatedTasklist.taskListId
            ? {
                ...taskList,
                ...pickBy(value => !isNil(value), action.updatedTasklist),
              }
            : taskList,
        ),
      };

    case DELETE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklist: state.tasklist.filter(
          taskList => taskList.taskListId !== action.taskListId,
        ),
      };

    case SET_AS_CURRENT_LIST:
      return {
        ...state,
        currentList: state.tasklist.find(
          taskList => taskList.taskListId === action.taskListId,
        ),
      };

    case IS_LIST:
      return {
        ...state,
        isList: action.boolean,
      };

    case REMOVEUSER_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklistmembers: state.tasklistmembers.filter(
          member => member.userId !== action.removedUser.userId,
        ),
      };

    case CHANGEUSERROLE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklistmembers: state.tasklistmembers.map(member =>
          member.userId === action.markedUser.userId
            ? { ...member, taskListUserRole: action.role }
            : member,
        ),
      };

    case GET_TASKLIST_STATS_SUCCESS:
      return {
        ...state,
        taskListStats: action.taskListStats,
        taskListStatsOk: true,
      };

    case GET_TASKLIST_STATS_FAILURE:
      return {
        ...state,
        taskListStats: null,
        taskListStatsOk: false,
      };

    case RESET_TASKLIST_STATS:
      return {
        ...state,
        taskListStats: null,
        taskListStatsOk: null,
      };

    default:
      return state;
  }
};

export default TaskListReducer;
