import axios from './axios-heydoc';

export function findInvitationsByUserId() {
  return axios.get('user/findInvitationsByUserId')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function acceptInviteToTaskList(tasklistId) {
  return axios.put('list/acceptInviteToTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function rejectInviteToTaskList(tasklistId) {
  return axios.put('list/rejectInviteToTaskList/' + tasklistId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}
