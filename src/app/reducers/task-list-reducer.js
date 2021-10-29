/* eslint-disable sonarjs/max-switch-cases */
/* eslint-disable sonarjs/cognitive-complexity */
import { lensProp, map, propEq, set, when, pickBy, isNil } from 'ramda';

import {
  ACCEPT_INVITE_TOTASKLIST_SUCCESS,
  REJECT_INVITE_TOTASKLIST_SUCCESS,
  ADD_TASKLIST_SUCCESS,
  CHANGEUSERROLE_TASKLIST_SUCCESS,
  DELETE_TASKLIST_SUCCESS,
  ARCHIVE_TASKLIST_SUCCESS,
  UNARCHIVE_TASKLIST_SUCCESS,
  GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS,
  GET_AUDITS_BY_ALLUSERLIST_SUCCESS,
  GET_AUDITS_BY_TASKLIST_SUCCESS,
  GET_NONORGUSERSINTASKLIST_SUCCESS,
  GET_TASKLIST_STATS_FAILURE,
  GET_TASKLIST_STATS_SUCCESS,
  GET_TASKLIST_SUCCESS,
  GET_TASKLISTACTIVEMEMBERS_SUCCESS,
  GET_TASKLISTMEMBERS_SUCCESS,
  INVITE_USER_TO_TASKLIST_SUCCESS,
  INVITE_PERSON_TASKLIST_SUCCESS,
  INVITEMULUSERS_TASKLIST_SUCCESS,
  REMOVEUSER_TASKLIST_SUCCESS,
  REQUEST_LISTS,
  RESET_TASKLIST_STATS,
  TOGGLE_LIST_NOTIFICATIONS_SUCCESS,
  UPDATE_TASKLIST_SUCCESS,
  CANCEL_TASKLIST_INVITE_SUCCESS,
  GET_PENDING_TASKLIST_SUCCESS,
  GET_ARCHIVED_TASKLIST_SUCCESS,
  UPDATE_LIST_COLUMNS_DISPLAY_SETUP,
  UPDATE_LIST_VIEW_SETUP,
  INITIALIZE_TASK_LIST_STATE,
  GET_CURRENT_TASK_LIST_FAILURE,
  GET_CURRENT_TASK_LIST,
  GET_CURRENT_TASK_LIST_SUCCESS,
} from 'actions/action-types';

const initialState = {
  currentTaskList: null,
  currentTaskListIdentifier: null,
  isFetchingCurrentTaskList: false,

  taskLists: null,
  archivedTaskLists: null,
  pendingTaskLists: null,
  tasklistmembers: [],
  allTaskListMembers: [],
  orgusersnotintasklist: [],
  nonorgusersintasklist: [],
  tasklistactivemembers: [],
  tasklistaudits: [],
  auditsForAllUserList: [],
  activityFeedForAllUserList: [],
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

const inviteUser = (state, { user }) => ({
  ...state,
  tasklistmembers: [...state.tasklistmembers, inviteUserMapper(user)],
});

const inviteMultipleUsers = (state, { invitedUsersIdentifier }) => ({
  ...state,
  tasklistmembers: [
    ...state.tasklistmembers,
    ...state.orgusersnotintasklist
      .filter(user =>
        invitedUsersIdentifier.some(
          userIdentifier => user.userIdentifier === userIdentifier,
        ),
      )
      .map(inviteUserMapper),
  ],
  orgusersnotintasklist: state.orgusersnotintasklist.filter(user =>
    invitedUsersIdentifier.every(
      userIdentifier => user.userIdentifier !== userIdentifier,
    ),
  ),
});

const TaskListReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_TASK_LIST_STATE:
      return {
        ...state,
        currentTaskListIdentifier: action.taskListIdentifier,
        currentTaskList: null,
      };

    case GET_CURRENT_TASK_LIST:
      return {
        ...state,
        isFetchingCurrentTaskList: true,
      };

    case GET_CURRENT_TASK_LIST_SUCCESS:
      return {
        ...state,
        currentTaskList: action.taskList,
        isFetchingCurrentTaskList: false,
      };

    case GET_CURRENT_TASK_LIST_FAILURE:
      return {
        ...state,
        currentTaskList: null,
        isFetchingCurrentTaskList: false,
      };

    case UPDATE_LIST_VIEW_SETUP: {
      const { setup, currentUserIdentifier } = action.payload;
      return {
        ...state,
        currentTaskList: {
          ...state.currentTaskList,
          listUsers: state.currentTaskList.listUsers.map(user =>
            user.identifier === currentUserIdentifier
              ? { ...user, displayOptions: setup }
              : user,
          ),
        },
      };
    }
    case UPDATE_LIST_COLUMNS_DISPLAY_SETUP: {
      const { setup, currentUserIdentifier } = action.payload;
      return {
        ...state,
        currentTaskList: {
          ...state.currentTaskList,
          listUsers: state.currentTaskList.listUsers.map(user =>
            user.identifier === currentUserIdentifier
              ? { ...user, displayColumns: setup }
              : user,
          ),
        },
      };
    }
    case INVITE_USER_TO_TASKLIST_SUCCESS:
      return inviteUser(state, action);

    case INVITEMULUSERS_TASKLIST_SUCCESS:
      return inviteMultipleUsers(state, action);

    case INVITE_PERSON_TASKLIST_SUCCESS:
      return {
        ...state,
      };

    case ADD_TASKLIST_SUCCESS:
      return {
        ...state,
        taskLists: [action.taskList].concat(state.taskLists),
      };

    case REQUEST_LISTS:
      return { ...state, isFetching: true };

    case ACCEPT_INVITE_TOTASKLIST_SUCCESS:
      return {
        ...state,
        taskLists: [action.taskList].concat(state.taskLists),
        pendingTaskLists: state.pendingTaskLists.filter(
          taskList =>
            taskList.taskListIdentifier !== action.taskList.taskListIdentifier,
        ),
      };

    case REJECT_INVITE_TOTASKLIST_SUCCESS:
      return {
        ...state,
        pendingTaskLists: state.pendingTaskLists.filter(
          taskList =>
            taskList.taskListIdentifier !== action.taskList.taskListIdentifier,
        ),
      };

    case GET_TASKLIST_SUCCESS:
      return {
        ...state,
        taskLists: action.taskLists,
        isFetching: false,
      };

    case GET_TASKLISTMEMBERS_SUCCESS: {
      const { taskListIdentifier, tasklistmembers } = action;

      const listMembersDetails = {
        taskListIdentifier,
        tasklistmembers,
      };

      const currentTaskListMembersDetails = state.allTaskListMembers.filter(
        details => details.taskListIdentifier === action.taskListIdentifier,
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
          listMembers.taskListIdentifier === action.taskListIdentifier
            ? { ...listMembers, listMembersDetails }
            : listMembers,
        ),
      };
    }

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
      const { taskListIdentifier, receiveNotifications } = action;

      const updateTasklist = map(
        when(
          propEq('taskListIdentifier', taskListIdentifier),
          set(lensProp('notifications'), receiveNotifications),
        ),
      );

      return {
        ...state,
        taskLists: updateTasklist(state.taskLists),
      };
    }

    case UPDATE_TASKLIST_SUCCESS:
      return {
        ...state,
        taskLists: state.taskLists.map(taskList =>
          taskList.taskListIdentifier ===
          action.updatedTasklist.taskListIdentifier
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
        taskLists: state.taskLists.filter(
          taskList => taskList.taskListIdentifier !== action.taskListIdentifier,
        ),
      };

    case ARCHIVE_TASKLIST_SUCCESS:
      return {
        ...state,
        archivedTaskLists: [
          ...state.archivedTaskLists,
          state.taskLists.find(
            taskList =>
              taskList.taskListIdentifier === action.taskListIdentifier,
          ),
        ],
        taskLists: state.taskLists.filter(
          taskList => taskList.taskListIdentifier !== action.taskListIdentifier,
        ),
      };

    case UNARCHIVE_TASKLIST_SUCCESS:
      return {
        ...state,
        taskLists: [
          ...state.taskLists,
          state.archivedTaskLists.find(
            taskList =>
              taskList.taskListIdentifier === action.taskListIdentifier,
          ),
        ],
        archivedTaskLists: state.archivedTaskLists.filter(
          taskList => taskList.taskListIdentifier !== action.taskListIdentifier,
        ),
      };

    case REMOVEUSER_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklistmembers: state.tasklistmembers.filter(
          member => member.userIdentifier !== action.removedUserIdentifier,
        ),
      };

    // eslint-disable-next-line sonarjs/no-duplicated-branches
    case CANCEL_TASKLIST_INVITE_SUCCESS:
      return {
        ...state,
        tasklistmembers: state.tasklistmembers.filter(
          member => member.userIdentifier !== action.removedUserIdentifier,
        ),
      };

    case CHANGEUSERROLE_TASKLIST_SUCCESS:
      return {
        ...state,
        tasklistmembers: state.tasklistmembers.map(member =>
          member.userIdentifier === action.markedUser.userIdentifier
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

    case GET_PENDING_TASKLIST_SUCCESS:
      return {
        ...state,
        pendingTaskLists: action.taskLists,
      };

    case GET_ARCHIVED_TASKLIST_SUCCESS:
      return {
        ...state,
        archivedTaskLists: action.taskLists,
      };

    default:
      return state;
  }
};

export default TaskListReducer;
