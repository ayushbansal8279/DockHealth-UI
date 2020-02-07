import { uniqBy, prop } from 'ramda';
import axios from './axios-heydoc';

export function findAllUsersByOrganizationId() {
  return axios
    .get('user/findAllUsersByOrganizationId')
    .then(response => {
      return response.data;
    })
    .catch(error => error.response.data);
}

export function findAllUsers() {
  return Promise.all([
    axios({
      method: 'get',
      url: '/user/findAllUsersByOrganizationId',
    }),
    axios({
      method: 'get',
      url: '/user/findAllInActiveUsersByOrganizationId',
    }),
  ])
    .then(([responseActive, responseInactive]) => {
      const allUsers = [
        ...responseActive.data.map(({ subscription, ...otherData }) => ({
          ...otherData,
          subscription: subscription ?? { subscriptionPlanName: 'Standard' },
        })),
        ...responseInactive.data.map(({ subscription, ...otherData }) => ({
          ...otherData,
          subscription: null,
        })),
      ];

      return uniqBy(prop('email'), allUsers);
    })
    .catch(error => error?.response?.data ?? error?.message);
}

export function getUserById(userId) {
  return axios
    .get(`user/${userId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => error.response.data);
}

export function invitePersonToOrganization(person) {
  return axios
    .put('organization/invitePersonToOrganization', person)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error?.response?.data ?? error;
    });
}

export function resendInviteToOrganization(person) {
  return axios
    .put('organization/resendInviteToOrganization', person)
    .then(response => {
      return response.data;
    })
    .catch(error => error.response.data);
}

export function changeUserRoleForOrg(markedUserId, role) {
  return axios
    .put(
      `${'organization/changeUserRoleForOrg/' +
        '?markedUserId='}${markedUserId}&role=${role}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data;
    });
}

export function cancelInviteToOrganization(markedUserEmail) {
  return axios
    .put(
      `${'organization/cancelInviteToOrganization/' +
        '?markedUserEmail='}${encodeURIComponent(markedUserEmail)}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => error.response.data);
}

export function removeUserFromOrganization(removedUserId) {
  return axios
    .delete(
      `${'user/removeUserFromOrganization' +
        '?removedUserId='}${removedUserId}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data;
    });
}

// export function getUserAvatar(user) {
//   return axios.get('user/profilePicture/'+user.userId+'?UserPictureType=PROFILE', {responseType: 'arraybuffer'})
//     .then(response => {
//       let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
//       let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
//       return image;
//     }).catch(response => {
//     })
// }

export function getUserAvatar(user) {
  return axios
    .get(`user/profilePicture/${user.userId}?UserPictureType=PROFILE`, {
      responseType: 'arraybuffer',
    }) // this lets axios know that response type is not JSON but binary data
    .then(response => {
      const binaryImage = Buffer.from(response.data, 'binary').toString(
        'base64',
      ); // base64 encoding of binary image data
      return `data:${response.headers[
        'content-type'
      ].toLowerCase()};base64,${binaryImage}`;
    })
    .catch(error => error.response.data);
}

export function getUserByEmail({ email }) {
  return axios({
    method: 'get',
    url: 'user/findUserByEmail',
    params: {
      email,
    },
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
