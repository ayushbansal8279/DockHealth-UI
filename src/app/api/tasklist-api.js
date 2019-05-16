import axios from './axios-heydoc';
import * as ActionTypes from '../actions/action-types';


export function getTaskListForUser() {
  // loading()
  return axios.get('list/findTaskListsByUserId')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findPendingTaskListsForUser() {
  return axios.get('list/findPendingTaskListsForUser')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}


export function addTaskList(tasklist) {
  return axios.post('list/', tasklist)
    .then(response => {
      toggleTaskForm()
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getTaskListById(taskListId) {
  return axios.get('list/' + taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function updateTaskList(taskList) { //userId - make sure authorized user can only update the task list
  return axios.put('list/', taskList)
    .then(response => {
      toggleTaskForm()
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getMembersByTaskListId(taskListId, memberStatus) {
  return axios.get('user/listAllUsersByTaskListId/' + taskListId + "?status=" + memberStatus)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function invitePersonToTaskList(tasklistId,personInfo) {
  return axios.put('list/invitePersonToTaskList/' + tasklistId,personInfo)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getOrganizationUsersNotInTaskList(tasklistId) {
  return axios.get('user/findOrganizationUsersNotInTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export const inviteUserToTaskList = (tasklistId, userId) => (
  axios.put(`/user/inviteUserToTaskList/${tasklistId}/user/${userId}`)
    .then(response => response.data)
    .catch(error => error.response.data)
);

export function inviteMultipleUsersToTaskList(tasklistId,invitedUsers) {
  var multiUserInvitation = {};
  multiUserInvitation.invitedUsers = invitedUsers;
  return axios.put('user/inviteMultipleUsersToTaskList/' + tasklistId, multiUserInvitation)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getNonOrgUsersByTaskList(taskListId) {
  return axios.get('user/findNonOrgUsersByTaskList/' + taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}


export function changeUserRoleForList(tasklistId,markedUserId,role) {
  return axios.put('list/changeUserRoleForList/' + tasklistId
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
  return axios.delete('list/deleteTaskListById/' + taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function removeUserFromList(taskListId,removedUserId) {
  return axios.delete('user/removeUserFromTaskList/' + taskListId
                  + "?removedUserId=" + removedUserId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function cancelInviteToTaskList(taskListId,email) {
  return axios.put('list/cancelInviteToTaskList/' + taskListId
                      +"?markedUserEmail=" +email)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findAuditsByTaskList(taskListId,queryStartPosition) {
  return axios.get('audit/findAuditsByTaskList/' + taskListId
                  +"?queryStartPosition=" +queryStartPosition)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return axios.get('audit/findAuditsForAllTaskListsByUserId/'
                  +"?queryStartPosition=" +queryStartPosition)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return axios.get('audit/findActivityFeedForAllTaskListsByUserId/'
                  +"?queryStartPosition=" +queryStartPosition)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function toggleListNotifications(taskListId, receiveNotifications){
  return axios.put('list/toggleUserNotificationsForTaskList/'+taskListId+'?notifications='+receiveNotifications)
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function findGenericListCountsForUser(){
  return axios.get('list/findGenericListCountsForUser')
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function downloadPDF(taskListId){
  return axios({
    url: 'list/downloadPDFForTasksInList?taskListId='+taskListId,
    method: 'GET',
    responseType: 'blob', // important
  })
  .then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DOCK_ActionGrid.pdf');
    document.body.appendChild(link);
    link.click();
    return "success";
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}
