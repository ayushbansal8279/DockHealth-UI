import * as TaskListApi from 'api/task-list-api';
import { noop } from 'helpers/utility-functions';
import { onTaskListInvitationAccepted } from 'helpers/ga-event-helper';
import * as AlertActions from 'alert/actions';
import * as ActionTypes from 'actions/action-types';
import AlertMessages from '../alert/AlertMessages';

export function initializeTaskListState(
  taskListIdentifier,
  currentTasksStatus,
) {
  return {
    type: ActionTypes.INITIALIZE_TASK_LIST_STATE,
    taskListIdentifier,
    currentTasksStatus,
  };
}

export function clearTaskListState() {
  return {
    type: ActionTypes.CLEAR_TASK_LIST_STATE,
  };
}

export function getCurrentTaskList() {
  return {
    type: ActionTypes.GET_CURRENT_TASK_LIST,
  };
}

export const updateUserListViewSetup = (
  taskListIdentifier,
  setup,
  currentUserIdentifier,
) => {
  return {
    type: ActionTypes.UPDATE_LIST_VIEW_SETUP,
    payload: { taskListIdentifier, setup, currentUserIdentifier },
  };
};

export const updateUserPageViewSetup = setup => {
  return {
    type: ActionTypes.UPDATE_USER_VIEW_SETUP,
    payload: { setup },
  };
};

export function getTaskListForUser() {
  return dispatch => {
    return TaskListApi.getTaskListForUser()
      .then(taskLists => {
        dispatch({ type: ActionTypes.GET_TASKLIST_SUCCESS, taskLists });
      })
      .catch(noop);
  };
}

export function getArchivedTaskListForUser() {
  return dispatch => {
    return TaskListApi.getArchivedTaskListForUser()
      .then(taskLists => {
        dispatch({
          type: ActionTypes.GET_ARCHIVED_TASKLIST_SUCCESS,
          taskLists,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function getPendingTaskListsForUser() {
  return dispatch => {
    return TaskListApi.getPendingTaskListsForUser()
      .then(taskLists => {
        dispatch({ type: ActionTypes.GET_PENDING_TASKLIST_SUCCESS, taskLists });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function loading() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_LISTS });
  };
}

export function saveTaskList(formProps) {
  if (formProps.taskListIdentifier) {
    return dispatch =>
      TaskListApi.updateTaskList(formProps)
        .then(updatedTasklist => {
          dispatch({
            type: ActionTypes.UPDATE_TASKLIST_SUCCESS,
            updatedTasklist,
          });
          dispatch(
            AlertActions.showGlobalAlert('Task List updated successfully!'),
          );
          return updatedTasklist;
        })
        .catch(error => {
          dispatch(
            AlertActions.showGlobalAlert(
              'Error in saving Task List details',
              'error',
            ),
          );
          throw error;
        });
  }

  return dispatch =>
    TaskListApi.addTaskList(formProps)
      .then(taskList => {
        dispatch({
          type: ActionTypes.ADD_TASKLIST_SUCCESS,
          // set the default role for now
          taskList: { ...taskList, role: 'OWNER' },
        });
        dispatch(
          AlertActions.showGlobalAlert('Task List created successfully!'),
        );
        return taskList;
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error in creating Task List details',
            'error',
          ),
        );
        throw error;
      });
}

export function getMembersByTaskListId(taskListIdentifier, memberStatus) {
  return dispatch =>
    TaskListApi.getMembersByTaskListId(taskListIdentifier, memberStatus)
      .then(tasklistmembers => {
        dispatch({
          type: ActionTypes.GET_TASKLISTMEMBERS_SUCCESS,
          taskListIdentifier,
          tasklistmembers,
        });
      })
      .catch(noop);
}

export function getActiveMembersByTaskListId(taskListIdentifier) {
  return dispatch =>
    TaskListApi.getMembersByTaskListId(taskListIdentifier, 'ACTIVE')
      .then(tasklistactivemembers => {
        dispatch({
          type: ActionTypes.GET_TASKLISTACTIVEMEMBERS_SUCCESS,
          tasklistactivemembers,
        });
      })
      .catch(noop);
}

export function invitePersonToTaskList(
  formProps,
  taskListIdentifier,
  showBanner = true,
) {
  const personInfo = {
    email: formProps.email,
    firstName: formProps.firstName,
    lastName: formProps.lastName,
  };

  return dispatch =>
    TaskListApi.invitePersonToTaskList(taskListIdentifier, personInfo).then(
      response => {
        dispatch({
          type: ActionTypes.INVITE_PERSON_TASKLIST_SUCCESS,
          addedUser: response,
        });
        if (showBanner) {
          dispatch(AlertActions.showGlobalAlert('Invitation sent!'));
        }

        return response;
      },
    );
}

export function clearMembersInTaskList() {
  return dispatch => {
    dispatch({
      type: ActionTypes.GET_TASKLISTMEMBERS_SUCCESS,
      users: [],
    });
  };
}

export const inviteUserToTaskList = (taskListIdentifier, user) => dispatch =>
  TaskListApi.inviteUserToTaskList(taskListIdentifier, user.userIdentifier)
    .then(() => {
      dispatch({
        type: ActionTypes.INVITE_USER_TO_TASKLIST_SUCCESS,
        user,
      });
    })
    .catch(error => {
      dispatch(
        AlertActions.showGlobalAlert(
          error?.errorMessage ??
            error?.message ??
            'Error inviting user to task list',
          'error',
        ),
      );
      throw error;
    });

export function inviteMultipleUsersToTaskList(
  taskListIdentifier,
  invitedUsersIdentifier,
) {
  return dispatch =>
    TaskListApi.inviteMultipleUsersToTaskList(
      taskListIdentifier,
      invitedUsersIdentifier,
    )
      .then(response => {
        dispatch({
          type: ActionTypes.INVITEMULUSERS_TASKLIST_SUCCESS,
          response,
          invitedUsersIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert('Invitations sent!'));
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert('Error in sending invitation', 'error'),
        );
        throw error;
      });
}

export function getNonOrgUsersByTaskList(taskListIdentifier) {
  return dispatch =>
    TaskListApi.getNonOrgUsersByTaskList(taskListIdentifier)
      .then(users => {
        dispatch({
          type: ActionTypes.GET_NONORGUSERSINTASKLIST_SUCCESS,
          users,
        });
      })
      .catch(noop);
}

/**
 * Updates user's role in a list.
 * @param {number} taskListIdentifier
 * @param {{userIdentifier: number}} markedUser
 * @param {('OWNER'|'ADMIN'|'MEMBER')} role
 * @returns {Promise}
 */
export function changeUserRoleForList(taskListIdentifier, markedUser, role) {
  return dispatch =>
    TaskListApi.changeUserRoleForList(
      taskListIdentifier,
      markedUser.userIdentifier,
      role,
    )
      .then(response => {
        dispatch({
          type: ActionTypes.CHANGEUSERROLE_TASKLIST_SUCCESS,
          response,
          markedUser,
          role,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert('Error in updating user role', 'error'),
        );
        throw error;
      });
}

export function deleteTaskListById(taskListIdentifier) {
  return dispatch =>
    TaskListApi.deleteTaskListById(taskListIdentifier)
      .then(response => {
        dispatch({
          type: ActionTypes.DELETE_TASKLIST_SUCCESS,
          response,
          taskListIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert('Task List deleted'));
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert('Error in deleting Task List', 'error'),
        );
        throw error;
      });
}

export function archiveTaskListById(taskListIdentifier) {
  return dispatch => {
    return TaskListApi.archiveTaskListById(taskListIdentifier, true)
      .then(response => {
        dispatch({
          type: ActionTypes.ARCHIVE_TASKLIST_SUCCESS,
          response,
          taskListIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert('Task List archived'));
      })
      .catch(() => {
        dispatch(
          AlertActions.showGlobalAlert('Error in archiving Task List', 'error'),
        );
      });
  };
}

export function unarchiveTaskListById(taskListIdentifier) {
  return dispatch =>
    TaskListApi.archiveTaskListById(taskListIdentifier, false)
      .then(response => {
        dispatch({
          type: ActionTypes.UNARCHIVE_TASKLIST_SUCCESS,
          response,
          taskListIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert('Task List unarchived'));
      })
      .catch(() => {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error in unarchiving Task List',
            'error',
          ),
        );
      });
}

export function removeUserFromTaskList(
  taskListIdentifier,
  removedUserIdentifier,
) {
  return dispatch =>
    TaskListApi.removeUserFromTaskList(
      taskListIdentifier,
      removedUserIdentifier,
    )
      .then(response => {
        dispatch({
          type: ActionTypes.REMOVEUSER_TASKLIST_SUCCESS,
          response,
          removedUserIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert('User removed successfully'));
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error in removing User from Task List',
            'error',
          ),
        );
        throw error;
      });
}

export function cancelInviteToTaskList(
  taskListIdentifier,
  cancelledUserIdentifier,
) {
  return dispatch =>
    TaskListApi.cancelInviteToTaskList(
      taskListIdentifier,
      cancelledUserIdentifier,
    )
      .then(response => {
        dispatch({
          type: ActionTypes.CANCEL_TASKLIST_INVITE_SUCCESS,
          response,
          removedUserIdentifier: cancelledUserIdentifier,
        });
        dispatch(
          AlertActions.showGlobalAlert('Invitation canceled successfully'),
        );
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error in canceling invitation',
            'error',
          ),
        );
        throw error;
      });
}

export function findAuditsByTaskList(taskListIdentifier, queryStartPosition) {
  return dispatch =>
    TaskListApi.findAuditsByTaskList(taskListIdentifier, queryStartPosition)
      .then(audits => {
        dispatch({ type: ActionTypes.GET_AUDITS_BY_TASKLIST_SUCCESS, audits });
      })
      .catch(noop);
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return dispatch =>
    TaskListApi.findAuditsForAllTaskListsByUserId(queryStartPosition)
      .then(auditsForAllUserList => {
        dispatch({
          type: ActionTypes.GET_AUDITS_BY_ALLUSERLIST_SUCCESS,
          auditsForAllUserList,
        });
      })
      .catch(noop);
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return dispatch =>
    TaskListApi.findActivityFeedForAllTaskListsByUserId(queryStartPosition)
      .then(activityFeedForAllUserList => {
        dispatch({
          type: ActionTypes.GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS,
          activityFeedForAllUserList,
        });
      })
      .catch(noop);
}

export function toggleListNotifications(
  taskListIdentifier,
  receiveNotifications,
) {
  return dispatch =>
    TaskListApi.toggleListNotifications(
      taskListIdentifier,
      receiveNotifications,
    )
      .then(() => {
        dispatch({
          type: ActionTypes.TOGGLE_LIST_NOTIFICATIONS_SUCCESS,
          taskListIdentifier,
          receiveNotifications,
        });
      })
      .catch(error => {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error in toggling notification for Task List',
            'error',
          ),
        );
        throw error;
      });
}

export function isInbox(boolean) {
  return dispatch => {
    dispatch({ type: ActionTypes.IS_INBOX, boolean });
  };
}

export function leaveList(taskListIdentifier) {
  return dispatch =>
    TaskListApi.leaveList(taskListIdentifier)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_TASKLIST_SUCCESS,
          taskListIdentifier,
        });
      })
      .catch(noop);
}

export function downloadPDF(taskListIdentifier) {
  return TaskListApi.downloadPDF(taskListIdentifier)
    .then(() => 'success')
    .catch(error => {
      throw error;
    });
}

// eslint-disable-next-line unicorn/consistent-function-scoping
export const getTaskListStats = ({ taskListIdentifier }) => async dispatch => {
  try {
    const { data } = await TaskListApi.getTaskListStats({ taskListIdentifier });
    dispatch({
      type: ActionTypes.GET_TASKLIST_STATS_SUCCESS,
      taskListStats: data,
    });
  } catch (error) {
    dispatch({ type: ActionTypes.GET_TASKLIST_STATS_FAILURE });
  }
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const resetTasklistStats = () => dispatch => {
  dispatch({
    type: ActionTypes.RESET_TASKLIST_STATS,
  });
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const getPersonTasklistAccumulatedStats = () => dispatch => {
  // TODO - implement API endpoint for downloading accumulated stats

  dispatch({
    type: ActionTypes.GET_TASKLIST_STATS_SUCCESS,
  });
};

export function acceptInviteToTaskList(taskList) {
  return dispatch => {
    return TaskListApi.acceptInviteToTaskList(taskList.taskListIdentifier)
      .then(response => {
        onTaskListInvitationAccepted();
        dispatch({
          type: ActionTypes.ACCEPT_INVITE_TOTASKLIST_SUCCESS,
          res: response,
          taskList,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function rejectInviteToTaskList(taskList) {
  return dispatch => {
    return TaskListApi.rejectInviteToTaskList(taskList.taskListIdentifier)
      .then(response => {
        dispatch({
          type: ActionTypes.REJECT_INVITE_TOTASKLIST_SUCCESS,
          res: response,
          taskList,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}

export const updateColumnOnListPreferences = (
  setup,
  taskListIdentifier,
  currentUserIdentifier,
) => ({
  type: ActionTypes.UPDATE_LIST_COLUMNS_DISPLAY_SETUP,
  payload: { setup, taskListIdentifier, currentUserIdentifier },
});

export function reorderTaskLists(payload) {
  const { reorderedLists } = payload;

  TaskListApi.sortTasksListsForUser(reorderedLists)
    .then(() => 'success')
    .catch(error => {
      throw error;
    });
}
