import * as ActionTypes from './action-types';
import * as TaskListApi from '../api/tasklist-api';
import * as UserApi from '../api/user-api';


//Find all TaskLists user belongs to
export function getTaskListForUser() {
  return function(dispatch) {
    return TaskListApi.getTaskListForUser().then(tasklist => {
      dispatch({type: ActionTypes.GET_TASKLIST_SUCCESS, tasklist});
      // loading()
    }).catch(error => {
      throw(error);
    });
  };
}

export function loading(){
  return function(dispatch){
    dispatch({type: ActionTypes.REQUEST_LISTS})
  }
}

export function setTaskListAsCurrentList(currentList){
  return function(dispatch){
    dispatch({type: ActionTypes.SET_CURRENT_LIST, currentList})
  }
}

export function saveTaskList(formProps) {
  if(formProps.taskListId != null && formProps.taskListId > 0){
    return function(dispatch) {
      return TaskListApi.updateTaskList(formProps).then(updatedTasklist => {
        dispatch({type: ActionTypes.UPDATE_TASKLIST_SUCCESS, updatedTasklist});
        toggleAlert("TaskList updated successfully!", "success")
      }).catch(error => {
        throw(error);
      });
    };
  }else{
    return function(dispatch) {
      return TaskListApi.addTaskList(formProps).then(tasklist => {
        dispatch({type: ActionTypes.ADD_TASKLIST_SUCCESS, tasklist});
        toggleAlert("TaskList created successfully!", "success")
      }).catch(error => {
        //console.log(error.message);
        throw(error);
        //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
      });
    };
  }
}


export function getTaskListById(taskListId){
  return function(dispatch) {
    return TaskListApi.getTaskListById(taskListId).then(currentList => {
      dispatch({type: ActionTypes.SET_CURRENT_LIST, currentList});
    }).catch(error => {
      throw(error);
    });
  };
}


export function getMembersByTaskListId(taskListId, memberStatus) {
  return function(dispatch) {
    return TaskListApi.getMembersByTaskListId(taskListId, memberStatus).then(tasklistmembers => {
      dispatch({type: ActionTypes.GET_TASKLISTMEMBERS_SUCCESS, taskListId, tasklistmembers});
    }).catch(error => {
      throw(error);
    });
  };
}

export function getActiveMembersByTaskListId(taskListId) {
  return function(dispatch) {
    return TaskListApi.getMembersByTaskListId(taskListId, 'ACTIVE').then(tasklistactivemembers => {
      dispatch({type: ActionTypes.GET_TASKLISTACTIVEMEMBERS_SUCCESS, tasklistactivemembers});
    }).catch(error => {
      throw(error);
    });
  };
}

export function invitePersonToTaskList(formProps,taskListId) {
  var personInfo = {email : formProps.email,
                  firstName:formProps.firstName,
                  lastName:formProps.lastName
                }

  return function(dispatch) {
    return TaskListApi.invitePersonToTaskList(taskListId,personInfo).then(res => {
      dispatch({type: ActionTypes.INVITEPERSON_TASKLIST_SUCCESS, res});
      toggleAlert("Invitation sent!", "success")
    }).catch(error => {
      //console.log(error.message);
      throw(error);
      //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
    });
  };
}

export function getOrganizationUsersNotInTaskList(tasklistId) {
  return function(dispatch) {
    return TaskListApi.getOrganizationUsersNotInTaskList(tasklistId).then(users => {
      dispatch({type: ActionTypes.GET_ORGUSERSNOTINTASKLIST_SUCCESS, users});
    }).catch(error => {
      throw(error);
    });
  };
}

export const inviteUserToTaskList = (tasklistId, userId) => dispatch => (
  TaskListApi.inviteUserToTaskList(tasklistId, userId)
    .then(() => {
      dispatch({ type: ActionTypes.INVITE_USER_TO_TASKLIST_SUCCESS, userId });
    })
    .catch((error) => { throw error; })
);

export function inviteMultipleUsersToTaskList(tasklistId,invitedUsers) {
  return function(dispatch) {
    return TaskListApi.inviteMultipleUsersToTaskList(tasklistId,invitedUsers).then(res => {
      dispatch({type: ActionTypes.INVITEMULUSERS_TASKLIST_SUCCESS, res, invitedUsers});
      toggleAlert("Invitations sent!", "success")
    }).catch(error => {
      //console.log(error.message);
      throw(error);
      //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
    });
  };
}


export function getNonOrgUsersByTaskList(taskListId) {
  return function(dispatch) {
    return TaskListApi.getNonOrgUsersByTaskList(taskListId).then(users => {
      dispatch({type: ActionTypes.GET_NONORGUSERSINTASKLIST_SUCCESS, users});
    }).catch(error => {
      throw(error);
    });
  };
}

export function changeUserRoleForList(tasklistId,markedUser,role) {
  return function(dispatch) {
    return TaskListApi.changeUserRoleForList(tasklistId,markedUser.userId,role).then(res => {
      dispatch({type: ActionTypes.CHANGEUSERROLE_TASKLIST_SUCCESS, res, markedUser, role});
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteTaskListById(taskListId) {
  return function(dispatch) {
    return TaskListApi.deleteTaskListById(taskListId).then(res => {
      dispatch({type: ActionTypes.DELETE_TASKLIST_SUCCESS, res, taskListId});
      toggleAlert("TaskList deleted", "success")
    }).catch(error => {
      throw(error);
    });
  };
}


export function removeUserFromList(taskListId,removedUser) {
  return function(dispatch) {
    return TaskListApi.removeUserFromList(taskListId,removedUser.userId).then(res => {
      dispatch({type: ActionTypes.REMOVEUSER_TASKLIST_SUCCESS, res, removedUser});
      toggleAlert("User removed successfully", "success")
    }).catch(error => {
      throw(error);
    });
  };
}

export function cancelInviteToTaskList(taskListId,email) {
  return function(dispatch) {
    return TaskListApi.cancelInviteToTaskList(taskListId,email).then(res => {
      dispatch({type: ActionTypes.CANCEL_TASKLIST_INVITE_SUCCESS, res});
    }).catch(error => {
      throw(error);
    });
  };
}

export function findAuditsByTaskList(taskListId,queryStartPosition) {
  return function(dispatch) {
    return TaskListApi.findAuditsByTaskList(taskListId,queryStartPosition).then(audits => {
      dispatch({type: ActionTypes.GET_AUDITS_BY_TASKLIST_SUCCESS, audits});
    }).catch(error => {
      throw(error);
    });
  };
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return function(dispatch) {
    return TaskListApi.findAuditsForAllTaskListsByUserId(queryStartPosition).then(auditsForAllUserList => {
      dispatch({type: ActionTypes.GET_AUDITS_BY_ALLUSERLIST_SUCCESS, auditsForAllUserList});
    }).catch(error => {
      throw(error);
    });
  };
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return function(dispatch) {
    return TaskListApi.findActivityFeedForAllTaskListsByUserId(queryStartPosition).then(activityFeedForAllUserList => {
      dispatch({type: ActionTypes.GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS, activityFeedForAllUserList});
    }).catch(error => {
      throw(error);
    });
  };
}

export function toggleListNotifications(taskListId, receiveNotifications){
  return function(dispatch){
    return TaskListApi.toggleListNotifications(taskListId, receiveNotifications).then(res => {
      dispatch({type: ActionTypes.TOGGLE_LIST_NOTIFICATIONS_SUCCESS, taskListId, receiveNotifications});
    }).catch(error => {
      throw(error);
    });
  }
}

export function storeAsCurrentList(taskListId){
  return function(dispatch){
    dispatch({type: ActionTypes.SET_AS_CURRENT_LIST, taskListId})
  }
}

export function isList(boolean){
  return function(dispatch){
    dispatch({type: ActionTypes.IS_LIST, boolean})
  }
}

export function isInbox(boolean){
  return function(dispatch){
    dispatch({type: ActionTypes.IS_INBOX, boolean})
  }
}

export function leaveList(taskListId){
  return function(dispatch){
    return UserApi.leaveList(taskListId).then(res => {
      dispatch({type: ActionTypes.DELETE_TASKLIST_SUCCESS, res, taskListId});
    }).catch(error => {
      throw(error);
    });
  }
};

export function getGenericListCounts(){
  return function(dispatch){
    return TaskListApi.findGenericListCountsForUser().then(lists => {
      dispatch({type: ActionTypes.SET_GENERIC_LIST_COUNTS, lists})
    }).catch(error => {
      throw(error);
    });
  }
};


export function downloadPDF(taskListId){
  return TaskListApi.downloadPDF(taskListId).then(response => {
    return "success"
  }).catch(error => {
    throw(error);
  });
};