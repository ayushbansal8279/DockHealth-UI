import axios from 'axios';

export function findAllUsersByOrganizationId() {
  axios.defaults.headers.common['CurrentUserId'] = "6"
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findAllUsersByOrganizationId')
    .then(response => {
      return response.data;
    });
}

export function getUserById(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/'+userId)
    .then(response => {
      return response.data;
    });
}

export function invitePersonToOrganization(person) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/invitePersonToOrganization', person)
    .then(response => {
      return response.data;
    });
}

export function changeUserRoleForOrg(markedUserId,role) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/changeUserRoleForOrg/'
                      +"?markedUserId=" +markedUserId
                      + "&role=" + role)
    .then(response => {
      return response.data;
    });
  }

  export function cancelInviteToOrganization(markedUserEmail) {
    return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/cancelInviteToOrganization/'
                        +"?markedUserEmail=" +markedUserEmail)
      .then(response => {
        return response.data;
      });
    }

    export function removeUserFromOrganization(removedUserId) {
      return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'user/removeUserFromOrganization'
                          +"?removedUserId=" +removedUserId)
        .then(response => {
          return response.data;
        });
      }
