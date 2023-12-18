import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function getUserAvatarBuffer(userIdentifier) {
  return axios
    .get(`user/profilePicture/${userIdentifier}?UserPictureType=PROFILE`, {
      responseType: 'arraybuffer',
    })
    .then((response) => {
      const dataBuffer = Buffer.from(response.data);

      return {
        data: dataBuffer,
        // initial 2 bytes of data indicates image format -> backend returns invalid content type
        // FF D8 - JPEG
        // eslint-disable-next-line unicorn/number-literal-case
        format: dataBuffer.readUInt16BE(0) === 0xff_d8 ? 'jpg' : 'png',
      };
    });
}

export function getUserById(userIdentifier) {
  return axios.get(`user/${userIdentifier}`).then(({ data }) => data);
}

export function getUserByEmail(email) {
  return axios
    .get(`user/findUserByEmail?email=${encodeURIComponent(email)}`)
    .then(({ data }) => data);
}

export function sendUserOnboardingAnswers({ answers }) {
  return axios.put(`user/updateUserPreferences`, answers);
}

export function approveOrDenyInvitation({
  requestIdentifier,
  decisionType,
  userIdentifier,
}) {
  return axios.put(
    `/invite/request/review/${requestIdentifier}/${decisionType}/${userIdentifier}`,
  );
}

export function updateNotificationSettings(settings) {
  return axios
    .put('/user/userNotificationSettings', {
      notificationSettings: settings,
    })
    .then(({ data }) => data);
}

export function getNotificationSettings() {
  return axios.get('/user/userNotificationSettings').then(({ data }) => data);
}

export function getUserActiveTasksCount(userId) {
  return axios.get(
    `/task/findCountOfAllTasksAssignedToSpecificUser?userId=${userId}&status=INCOMPLETE`,
  );
}

export function captureLocalTimezone() {
  const timezoneOffset = new Date().getTimezoneOffset() / 60;

  return axios
    .put(`/user/captureLocalTimezone?timezoneOffset=${timezoneOffset}`, {})
    .then(({ data }) => data);
}

export function deleteCurrentUserAvatar() {
  return axios.delete(`user/profilePicture`).then(({ data }) => data);
}

export function saveCurrentUserAvatar(avatarData) {
  return axios
    .post(`user/profilePicture`, avatarData, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
    .then(({ data }) => data);
}

export function updateCurrentUser(formProps) {
  const userProps = formProps;
  if (formProps.title) {
    userProps.titles = [
      {
        name: formProps.title,
      },
    ];
  }

  return axios.put(`user`, userProps).then(({ data }) => data);
}

export const updateUser = (user) =>
  axios.patch(`user`, user).then(({ data }) => data);

export function getCurrentUserNotificationPreferences() {
  return axios.get('user/userNotificationPreferences').then(({ data }) => data);
}

export function updateCurrentUserPreferences(preferences) {
  return axios
    .put(`user/updateUserPreferences`, preferences)
    .then(({ data }) => data);
}

export function acknowledgeEula() {
  return axios.put('/user/acknowledgeEULA').then(({ data }) => data);
}

export function updateUserViewSetup(setup) {
  return axios
    .put('user/updateUserPreferences', setup)
    .then(({ data }) => data);
}

export function getUserTaskStats(userIdentifier) {
  return axios
    .get(`task/stats/getTaskStatsForUser/${userIdentifier}`)
    .then(({ data }) => data);
}

export function getUserTasks(userIdentifier, sortBy, status) {
  return axios
    .get(`task/findTasksAssignedToSpecificUser?userId=${userIdentifier}`, {
      params: {
        status,
        sortBy: sortBy?.key || undefined,
        sortDirection: sortBy?.order || undefined,
      },
    })
    .then((response) => response.data);
}

// here
export function getUserFilteredTasks(
  userIdentifier,
  sortBy,
  selectedFilters,
  status,
) {
  return axios
    .post(
      `task/filter/filterTasksByCriteriaForAssignedToUser/${userIdentifier}`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
      {
        params: {
          status,
          sortBy: sortBy?.key || undefined,
          sortDirection: sortBy?.order || undefined,
        },
      },
    )
    .then(({ data }) => data.tasks);
}

export function getUserTaskFilterOptions(
  userIdentifier,
  status,
  selectedFilters,
) {
  const request = selectedFilters
    ? axios
        .post(
          `task/filter/filterTasksByCriteriaForAssignedToUser/${userIdentifier}?includeOptions=true`,
          mapSelectedOptionsToRequestPayload(selectedFilters),
          {
            params: {
              status,
            },
          },
        )
        .then(({ data }) => data.taskFilterOptions)
    : axios
        .get(`task/filter/filterOptionsForAssignedToUser/${userIdentifier}`, {
          params: {
            status,
          },
        })
        .then(({ data }) => data);

  return request.then((options) => mapFilterOptions(options));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUsersByName(name, limit = 100) {
  return axios
    .get(`user/findUserByName?name=${name}&limit=${limit}`)
    .then(({ data }) => data);
}
// Expire Bearer Token on Logout and Auto Logout
export function userLogout() {
  return axios
    .put(
      `/user/logout?tokenString=${window.sessionStorage.getItem(
        'accessToken',
      )}`,
      // {
      //   headers: {
      //     CurrentUserId: `${window.sessionStorage.getItem('userIdentifier')}`,
      //   },
      // },
    )
    .then(({ data }) => data);
}
