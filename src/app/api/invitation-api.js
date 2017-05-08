import axios from 'axios';

export function findInvitationsByUserId(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findInvitationsByUserId/'+userId)
    .then(response => {
      return response.data;
    });
}

export function acceptInviteToTaskList(tasklistId,userId) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'list/acceptInviteToTaskList/' + tasklistId + "?userId=" + userId)
    .then(response => {
      return response.data;
    });
}

export function rejectInviteToTaskList(tasklistId,userId) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'list/rejectInviteToTaskList/' + tasklistId + "?userId=" + userId)
    .then(response => {
      return response.data;
    });
}
