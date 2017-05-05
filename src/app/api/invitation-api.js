import axios from 'axios';

export function findInvitationsByUserId(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findInvitationsByUserId/'+userId)
    .then(response => {
      return response.data;
    });
}
