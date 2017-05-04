import * as ActionTypes from './action-types';
import * as TaskListApi from '../api/tasklist-api'


//Find all TaskLists user belongs to
export function getTaskListForUser(userId) {
  return function(dispatch) {
    return TaskListApi.getTaskListForUser(userId).then(tasklist => {
      dispatch({type: ActionTypes.GET_TASKLIST_SUCCESS, tasklist});
    }).catch(error => {
      throw(error);
    });
  };
}

export function addTaskList(formProps,orgId) {
  var creator = {userId : '1'}
  var taskObject = {creator, listName: formProps.tasklistname};

  return function(dispatch) {
    return TaskListApi.addTaskList(taskObject,orgId).then(tasklist => {
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


export function updateTaskList(formProps,userId,taskListId)  {

  var taskObject = {listName: formProps.tasklistname, taskListId:taskListId};
  return function(dispatch) {
    return TaskListApi.updateTaskList(userId,taskObject).then(updtasklist => {
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
                  lastName:formProps.lastName,
                  invitingUserId:1,
                  organizationId:1
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

export function getOrganizationUsersNotInTaskList(tasklistId,organizationId) {
  return function(dispatch) {
    return TaskListApi.getOrganizationUsersNotInTaskList(tasklistId,organizationId).then(users => {
      dispatch({type: ActionTypes.GET_ORGUSERSNOTINTASKLIST_SUCCESS, users});
    }).catch(error => {
      throw(error);
    });
  };
}


export function inviteMultipleUsersToTaskList(tasklistId,invitingUserId,invitedUsers) {
  return function(dispatch) {
    return TaskListApi.inviteMultipleUsersToTaskList(tasklistId,invitingUserId,invitedUsers).then(res => {
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


export function changeUserRoleForList(tasklistId,settingUserId,markedUserId,role) {
  return function(dispatch) {
    return TaskListApi.changeUserRoleForList(tasklistId,settingUserId,markedUserId,role).then(res => {
      dispatch({type: ActionTypes.CHANGEUSERROLE_TASKLIST_SUCCESS, res});
    }).catch(error => {
      throw(error);
    });
  };
}
