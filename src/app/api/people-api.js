import { uniqBy, prop } from 'ramda';
import axios from './axios-heydoc';

export function findAllUsersByOrganizationId() {
  return axios
    .get('user/findAllUsersByOrganizationId')
    .then(response => {
      return response.data;
    })
    .catch(error => error?.response?.data);
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
        ...responseInactive.data.map(({ ...otherData }) => ({
          ...otherData,
          subscription: null,
        })),
      ];

      return uniqBy(prop('email'), allUsers);
    })
    .catch(error => {
      throw new Error(error?.response?.data ?? error?.message);
    });
}

export function getUserById(userIdentifier) {
  return axios
    .get(`user/${userIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => error?.response?.data);
}

export function invitePersonToOrganization(person) {
  return axios({
    url: 'organization/invitePersonToOrganization',
    method: 'put',
    data: person,
  })
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw error;
    });
}

export function resendInviteToOrganization(markedUserIdentifier) {
  return axios
    .put(
      `${'organization/resendInviteToOrganization/' +
        '?userIdentifier='}${markedUserIdentifier}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export function changeUserRoleForOrg(markedUserIdentifier, role) {
  return axios
    .put(
      `${'organization/changeUserRoleForOrg/' +
        '?markedUserId='}${markedUserIdentifier}&role=${role}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export function cancelInviteToOrganization(markedUserIdentifier) {
  return axios
    .put(
      `${'organization/cancelInviteToOrganization/' +
        '?userIdentifier='}${markedUserIdentifier}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export function removeUserFromOrganization(removedUserIdentifier) {
  return axios
    .delete(
      `${'user/removeUserFromOrganization' +
        '?userIdentifier='}${removedUserIdentifier}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export function addUserToOrganization(addedUserIdentifier) {
  return axios
    .put(
      `${'user/addUserToOrganization?userIdentifier='}${addedUserIdentifier}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

// export function getUserAvatar(user) {
//   return axios.get('user/profilePicture/'+user.userIdentifier+'?UserPictureType=PROFILE', {responseType: 'arraybuffer'})
//     .then(response => {
//       let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
//       let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
//       return image;
//     }).catch(response => {
//     })
// }

export function getUserAvatar(user) {
  return axios
    .get(`user/profilePicture/${user.userIdentifier}?UserPictureType=PROFILE`, {
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
    .catch(error => error?.response?.data);
}

export function getUserAvatarBuffer(user) {
  return axios
    .get(`user/profilePicture/${user.userIdentifier}?UserPictureType=PROFILE`, {
      responseType: 'arraybuffer',
    })
    .then(response => {
      const dataBuffer = Buffer.from(response.data);

      return {
        data: dataBuffer,
        // initial 2 bytes of data indicates image format -> backend returns invalid content type
        // FF D8 - JPEG
        // eslint-disable-next-line unicorn/number-literal-case
        format: dataBuffer.readUInt16BE(0) === 0xffd8 ? 'jpg' : 'png',
      };
    })
    .catch(error => error?.response?.data);
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
