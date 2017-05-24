import * as ActionTypes from './action-types';
import * as TaskListApi from '../api/tasklist-api'


//Find all TaskLists user belongs to
export function getTaskListForUser() {
  return function(dispatch) {
    return TaskListApi.getTaskListForUser().then(tasklist => {
      dispatch({type: ActionTypes.GET_TASKLIST_SUCCESS, tasklist});
    }).catch(error => {
      throw(error);
    });
  };
}

export function addTaskList(formProps) {
  var taskObject = {listName: formProps.tasklistname};

  return function(dispatch) {
    return TaskListApi.addTaskList(taskObject).then(tasklist => {
      dispatch({type: ActionTypes.ADD_TASKLIST_SUCCESS, tasklist});
    }).catch(error => {
      //console.log(error.message);
      throw(error);
      //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
    });
  };
}


export function getTaskListById(taskListId){
  return function(dispatch) {
    return TaskListApi.getTaskListById(taskListId).then(tasklistone => {
      dispatch({type: ActionTypes.GET_TASKLIST_ONE_SUCCESS, tasklistone});
    }).catch(error => {
      throw(error);
    });
  };
}


export function updateTaskList(formProps,taskListId)  {

  var taskObject = {listName: formProps.tasklistname, taskListId:taskListId};
  return function(dispatch) {
    return TaskListApi.updateTaskList(taskObject).then(updtasklist => {
      dispatch({type: ActionTypes.UPDATE_TASKLIST_SUCCESS, updtasklist});
    }).catch(error => {
      throw(error);
    });
  };
}


export function getMembersByTaskListId(taskListId, memberStatus) {
  return function(dispatch) {
    return TaskListApi.getMembersByTaskListId(taskListId,memberStatus).then(tasklistmembers => {
      dispatch({type: ActionTypes.GET_TASKLISTMEMBERS_SUCCESS, tasklistmembers});
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


export function inviteMultipleUsersToTaskList(tasklistId,invitedUsers) {
  return function(dispatch) {
    return TaskListApi.inviteMultipleUsersToTaskList(tasklistId,invitedUsers).then(res => {
      dispatch({type: ActionTypes.INVITEMULUSERS_TASKLIST_SUCCESS, res});
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

export function getActiveMembersByTaskListId(taskListId, memberStatus) {
  return function(dispatch) {
    return TaskListApi.getMembersByTaskListId(taskListId,memberStatus).then(tasklistactivemembers => {
      dispatch({type: ActionTypes.GET_TASKLISTACTIVEMEMBERS_SUCCESS, tasklistactivemembers});
    }).catch(error => {
      throw(error);
    });
  };
}


export function changeUserRoleForList(tasklistId,markedUserId,role) {
  return function(dispatch) {
    return TaskListApi.changeUserRoleForList(tasklistId,markedUserId,role).then(res => {
      dispatch({type: ActionTypes.CHANGEUSERROLE_TASKLIST_SUCCESS, res});
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteTaskListById(taskListId) {
  return function(dispatch) {
    return TaskListApi.deleteTaskListById(taskListId).then(res => {
      dispatch({type: ActionTypes.DELETE_TASKLIST_SUCCESS, res});
    }).catch(error => {
      throw(error);
    });
  };
}


export function removeUserFromList(taskListId,removedUserId) {
  return function(dispatch) {
    return TaskListApi.removeUserFromList(taskListId,removedUserId).then(res => {
      dispatch({type: ActionTypes.REMOVEUSER_TASKLIST_SUCCESS, res});
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
