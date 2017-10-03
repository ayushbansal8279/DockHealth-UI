import axios from 'axios';
import * as ActionTypes from '../actions/action-types';


export function getTaskListForUser() {
  // loading()
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/findTaskListsByUserId')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findPendingTaskListsForUser() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/findPendingTaskListsForUser')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}


export function addTaskList(tasklist) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'list/', tasklist)
    .then(response => {
      toggleTaskForm()
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getTaskListById(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/' + taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function updateTaskList(taskList) { //userId - make sure authorized user can only update the task list
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/', taskList)
    .then(response => {
      toggleTaskForm()
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getMembersByTaskListId(taskListId, memberStatus) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/listAllUsersByTaskListId/' + taskListId + "?status=" + memberStatus)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function invitePersonToTaskList(tasklistId,personInfo) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/invitePersonToTaskList/' + tasklistId,personInfo)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getOrganizationUsersNotInTaskList(tasklistId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findOrganizationUsersNotInTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function inviteMultipleUsersToTaskList(tasklistId,invitedUsers) {
  var multiUserInvitation = {};
  multiUserInvitation.invitedUsers = invitedUsers;
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'user/inviteMultipleUsersToTaskList/' + tasklistId, multiUserInvitation)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getNonOrgUsersByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findNonOrgUsersByTaskList/' + taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}


export function changeUserRoleForList(tasklistId,markedUserId,role) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/changeUserRoleForList/' + tasklistId
                      +"?markedUserId=" +markedUserId
                      + "&role=" + role)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function deleteTaskListById(taskListId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'list/deleteTaskListById/' + taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function removeUserFromList(taskListId,removedUserId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'user/removeUserFromTaskList/' + taskListId
                  + "?removedUserId=" + removedUserId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function cancelInviteToTaskList(taskListId,email) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/cancelInviteToTaskList/' + taskListId
                      +"?markedUserEmail=" +email)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findAuditsByTaskList(taskListId,queryStartPosition) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'audit/findAuditsByTaskList/' + taskListId
                  +"?queryStartPosition=" +queryStartPosition)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'audit/findAuditsForAllTaskListsByUserId/'
                  +"?queryStartPosition=" +queryStartPosition)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'audit/findActivityFeedForAllTaskListsByUserId/'
                  +"?queryStartPosition=" +queryStartPosition)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function toggleListNotifications(taskListId, receiveNotifications){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/toggleUserNotificationsForTaskList/'+taskListId+'?notifications='+receiveNotifications)
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function findGenericListCountsForUser(){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/findGenericListCountsForUser')
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}
