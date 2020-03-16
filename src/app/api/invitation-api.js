import axios from './axios-heydoc';

export function findInvitationsByUserId() {
  return axios
    .get('user/findInvitationsByUserId')
    .then(response => {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function acceptInviteToTaskList(taskListIdentifier) {
  return axios
    .put(`list/acceptInviteToTaskList/${taskListIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function rejectInviteToTaskList(taskListIdentifier) {
  return axios
    .put(`list/rejectInviteToTaskList/${taskListIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}
