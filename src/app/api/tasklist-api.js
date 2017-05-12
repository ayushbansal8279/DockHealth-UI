import axios from 'axios';
import * as ActionTypes from '../actions/action-types';


export function getTaskListForUser() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/findTaskListsByUserId')
    .then(response => {
      return response.data;
    });
}


export function addTaskList(tasklist) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'list/', tasklist)
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

export function updateTaskList(taskList) { //userId - make sure authorized user can only update the task list
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/', taskList)
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
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/invitePersonToTaskList/' + tasklistId,personInfo)
    .then(response => {
      return response.data;
    });
}

export function getOrganizationUsersNotInTaskList(tasklistId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findOrganizationUsersNotInTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    });
}

export function inviteMultipleUsersToTaskList(tasklistId,invitedUsers) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'user/inviteMultipleUsersToTaskList/' + tasklistId, invitedUsers)
    .then(response => {
      return response.data;
    });
}

export function getNonOrgUsersByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findNonOrgUsersByTaskList/' + taskListId)
    .then(response => {
      return response.data;
    });
}


export function changeUserRoleForList(tasklistId,markedUserId,role) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/changeUserRoleForList/' + tasklistId
                      +"?markedUserId=" +markedUserId
                      + "&role=" + role)
    .then(response => {
      return response.data;
    });
}
