import axios from './axios-heydoc';

export function getAllUserGroups() {
  return axios.get(`user/list/getAll`).then(({ data }) => data);
}

export function getUserGroupDetails(userGroupIdentifier) {
  return axios.get(`user/list/${userGroupIdentifier}`).then(({ data }) => data);
}

export function createUserGroup(userGroup) {
  return axios.post(`user/group`, userGroup).then(({ data }) => data);
}

export function updateUserGroup(userGroupIdentifier, userGroupData) {
  return axios
    .patch(`user/group`, { ...userGroupData, identifier: userGroupIdentifier })
    .then(({ data }) => data);
}

export function deleteUserGroup(userGroupIdentifier) {
  return axios
    .delete(`user/group/removeUserGroupFromOrganization`, {
      params: { userGroupIdentifier },
    })
    .then(({ data }) => data);
}

export function createUserGroupAvatar(userGroupIdentifier, avatarBuffer) {
  return axios
    .post(`user/profilePicture/${userGroupIdentifier}`, avatarBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
    .then(({ data }) => data);
}

export function deleteUserGroupAvatar(userGroupIdentifier) {
  return axios
    .delete(`user/profilePicture/${userGroupIdentifier}`)
    .then(({ data }) => data);
}
