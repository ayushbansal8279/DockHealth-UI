import axios from 'axios';

export function findInvitationsByUserId() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findInvitationsByUserId')
    .then(response => {
      return response.data;
    });
}

export function acceptInviteToTaskList(tasklistId) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/acceptInviteToTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    });
}

export function rejectInviteToTaskList(tasklistId) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'list/rejectInviteToTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    });
}
