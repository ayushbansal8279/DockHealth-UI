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

export function addTaskList(formProps) {
  var creator = {userId : '1'}
  var taskObject = {creator, listName: formProps.tasklistname};

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
      dispatch({type: ActionTypes.ADD_TASKLIST_SUCCESS, res});
    }).catch(error => {
      //console.log(error.message);
      throw(error);
      //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
    });
  };
}
