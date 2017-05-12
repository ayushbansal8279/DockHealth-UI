import axios from 'axios';

export function findAllUsersByOrganizationId() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findAllUsersByOrganizationId')
    .then(response => {
      return response.data;
    });
}
