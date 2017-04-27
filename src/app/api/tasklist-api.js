import axios from 'axios';
import * as ActionTypes from '../actions/action-types';


export function getTaskListForUser(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/findTaskListsByUserId/'+userId)
    .then(response => {
      return response.data;
    });
}


export function addTaskList(tasklist) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list', tasklist)
    .then(response => {
      return response.data;
    });
}

export function getTaskListById(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/' + taskListId)
    .then(response => {
      return response.data;
    });
}

export function updateTaskList(userId,taskList) { //userId - make sure authorized user can only update the task list
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'list/' + userId, taskList)
    .then(response => {
      return response.data;
    });
}

export function getMembersByTaskListId(taskListId, memberStatus) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/listAllUsersByTaskListId/' + taskListId + "?status=" + memberStatus)
    .then(response => {
      return response.data;
    });
}

export function invitePersonToTaskList(tasklistId,personInfo) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'list/invitePersonToTaskList/' + tasklistId,personInfo)
    .then(response => {
      return response.data;
    });
}

export function getOrganizationUsersNotInTaskList(tasklistId,organizationId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findOrganizationUsersNotInTaskList/' + tasklistId  + "?organizationId=" + organizationId)
    .then(response => {
      return response.data;
    });
}

export function inviteMultipleUsersToTaskList(tasklistId,invitingUserId,invitedUsers) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'user/inviteMultipleUsersToTaskList/' + tasklistId+ "?invitingUserId=" + invitingUserId, invitedUsers)
    .then(response => {
      return response.data;
    });
}
