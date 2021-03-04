/* eslint-disable sonarjs/no-duplicate-string */
import { isNil } from 'ramda';
import Amplify from '@aws-amplify/core';
import { onLogin, onLogout, onTaskListLeft } from 'helpers/ga-event-helper';
import { RESET_APP } from 'actions/action-types';
import { noop } from 'helpers/utility-functions';
import { dummyAccess } from 'reducers/user-reducer';
import Auth from '@aws-amplify/auth';
import configureStore from '../ConfigureStore';
import axios from './axios-heydoc';
import sendEvent from './usage-api';

const store = configureStore();

// eslint-disable-next-line import/no-mutable-exports
export let resolvedCognitoUser = null;

Amplify.configure({
  // To get the AWS Credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  Auth: {
    region: process.env.AWS_REGION,
    userPoolId: process.env.AWS_USERPOOLID,
    userPoolWebClientId: process.env.AWS_CLIENTAPP,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

// register a new user
export function register(userData) {
  const attributes = {};

  const { username: unformattedUsername, password, ...user } = userData;

  const username = unformattedUsername?.toLowerCase();

  Object.keys(user).forEach(userDataKey => {
    const userDataValue = user[userDataKey];
    attributes[userDataKey] = userDataValue;
  });

  return new Promise((resolve, reject) => {
    Auth.signUp({
      username,
      password,
      attributes,
      validationData: [], // optional
    })
      .then(data => {
        // console.log(data)
        resolvedCognitoUser = data.user;
        store.dispatch({ type: 'user/user', user: data.user });
        resolve(data.user);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

// confirm user registration
export function confirmRegistration(userData) {
  let { username } = userData;
  const { confirmationCode } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  return new Promise((resolve, reject) => {
    // After retrieving the confirmation code from the user
    Auth.confirmSignUp(username, confirmationCode, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true,
    })
      .then(data => {
        resolve(data.user);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export function resendConfirmationCode(userData) {
  let { username } = userData;
  if (username) {
    username = username.toLowerCase();
  }

  return new Promise((resolve, reject) => {
    Auth.resendSignUp(username)
      .then(data => {
        resolvedCognitoUser = data.user;
        resolve(data.user);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export function changePassword(oldPassword, newPassword) {
  const { user } = store.getState().userState;
  return Auth.changePassword(user, oldPassword, newPassword);
}

export function logout(history) {
  window.sessionStorage.removeItem('confirmStatus');
  history.replace('login');

  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
      sessionStorage.removeItem('EnterpriseUserFlag');
      sessionStorage.removeItem('SSO_ACCESSTOKEN');
      sessionStorage.removeItem('SSO_REFRESHTOKEN');
      sessionStorage.removeItem('SSO_USEREMAIL');
      resolve();
    } else {
      Auth.signOut()
        .then(() => {
          resolvedCognitoUser = null;
          store.dispatch({ type: 'user/user', user: null });
          store.dispatch({ type: RESET_APP });
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('userIdentifier');
          sessionStorage.removeItem('userProfile');
          sessionStorage.removeItem('authUser');
          sessionStorage.removeItem('sessionStartTime');
          sessionStorage.removeItem('currentOrganizationIdentifier');
          sessionStorage.removeItem('notificationsEnabled');
          sessionStorage.removeItem('hasUnreadAlerts');
          sessionStorage.removeItem('redirectToHome');
          sessionStorage.removeItem('redirectToLink');
          sessionStorage.removeItem('selectedTaskIdentifier');
          onLogout();
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    }
  });
}

export function login(loginUserName, password) {
  const username = loginUserName?.toLowerCase();

  sessionStorage.removeItem('EnterpriseUserFlag');
  sessionStorage.removeItem('SSO_ACCESSTOKEN');
  sessionStorage.removeItem('SSO_REFRESHTOKEN');
  sessionStorage.removeItem('SSO_USEREMAIL');
  return new Promise((resolve, reject) => {
    Auth.signIn({
      username, // Required, the username
      password, // Optional, the password
    })
      .then(user => {
        resolvedCognitoUser = user;
        if (
          user.challengeName === 'SMS_MFA' ||
          user.challengeName === 'SOFTWARE_TOKEN_MFA'
        ) {
          resolve(user);
        } else {
          store.dispatch({ type: 'user/user', user });
          sessionStorage.setItem(
            'accessToken',
            user.signInUserSession.accessToken.jwtToken,
          );
          sendEvent({
            eventAction: 'LOGIN_SUCCESS',
            eventCategory: 'AUTH',
            usageEventType: 'USAGE_ACTION',
          });
          resolve(user);
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

// confirm user registration
export function sendMFACode(userData) {
  let { username } = userData;
  const { mfaCode } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  return new Promise((resolve, reject) => {
    Auth.confirmSignIn(
      resolvedCognitoUser, // Return object from Auth.signIn()
      mfaCode, // Confirmation code
      'SMS_MFA', // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
    )
      .then(loggedUser => {
        resolvedCognitoUser = loggedUser;
        store.dispatch({ type: 'user/user', user: loggedUser });
        sessionStorage.setItem(
          'accessToken',
          loggedUser.signInUserSession.accessToken.jwtToken,
        );
        sendEvent({
          eventAction: 'LOGIN_SUCCESS',
          eventCategory: 'AUTH',
          usageEventType: 'USAGE_ACTION',
        });
        resolve(loggedUser);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export function rememberDevice() {
  return new Promise(resolve => {
    Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        user.getCachedDeviceKeyAndPassword(); // without this line, the deviceKey is null
        user.setDeviceStatusRemembered({
          onSuccess: result => {
            resolve(result);
          },
          onFailure: noop,
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
}

export async function isAuthenticated() {
  if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
    const userData = {
      username: sessionStorage.getItem('SSO_USEREMAIL'),
    };

    if (sessionStorage.getItem('SSO_ACCESSTOKEN')) {
      return { isLoggedIn: true, user: userData };
    }

    return { isLoggedIn: false, user: userData };
  }

  try {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const authData = await Auth.currentSession();
    sessionStorage.setItem('accessToken', authData.accessToken.jwtToken);
    return { isLoggedIn: true, user };
  } catch (error) {
    console.log(error);
    if (sessionStorage.getItem('accessToken')) {
      const authUser = JSON.parse(sessionStorage.getItem('authUser'));
      return { isLoggedIn: true, user: authUser };
    }
    return { isLoggedIn: false, user: null };
  }
}

export function forgotPassword(userData) {
  let { username } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  return new Promise((resolve, reject) => {
    Auth.forgotPassword(username)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export function resetPassword(userData) {
  let { username } = userData;
  const { verificationCode, password } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  return new Promise((resolve, reject) => {
    Auth.forgotPasswordSubmit(username, verificationCode, password)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export function createUser(user) {
  return axios.put('user', user).then(response => {
    store.dispatch({
      type: 'user/userIdentifier',
      userIdentifier: response?.data.userIdentifier,
    });
    return response;
  });
}

export async function getUserOrganization() {
  // eslint-disable-next-line no-return-await
  return await axios.get('user/findUserOrganizations');
}

export function getUserByEmailAndAccessToken(userEmail, accessToken) {
  const authString = 'Bearer '.concat(accessToken);
  axios.defaults.headers.common.Authorization = authString;

  const email = userEmail?.toLowerCase();

  return new Promise((resolve, reject) => {
    axios
      .get(
        `${
          process.env.HEYDOC_SERVICES_BASE_URL
        }user/findUserByEmail?email=${encodeURIComponent(email)}`,
      )
      .then(response => {
        getUserOrganization().then(({ data: orgData }) => {
          const userProfile = { ...response?.data, userOrganizations: orgData };
          store.dispatch({
            type: 'user/userProfile',
            userProfile,
          });
          sessionStorage.setItem(
            'userIdentifier',
            response?.data?.userIdentifier,
          );
          sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
          const currentOrgIdentifier = sessionStorage.getItem(
            'currentOrganizationIdentifier',
          );

          if (
            currentOrgIdentifier === 'undefined' ||
            currentOrgIdentifier === 'null' ||
            currentOrgIdentifier === '' ||
            !currentOrgIdentifier
          ) {
            sessionStorage.setItem(
              'currentOrganizationIdentifier',
              response?.data?.organizationIdentifier,
            );
            axios.defaults.headers.common.CurrentOrganizationIdentifier =
              response?.data?.organizationIdentifier;
          }
          onLogin();
          resolve({ ...userProfile, access: dummyAccess });
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getUserByEmail(email, cognitoUser) {
  let accessToken = '';

  if (cognitoUser.signInUserSession) {
    accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;
  }

  if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
    accessToken = sessionStorage.getItem('SSO_ACCESSTOKEN');
  }

  // eslint-disable-next-line no-return-await
  return await getUserByEmailAndAccessToken(email, accessToken);
}

export function getUserById() {
  return getUserOrganization().then(({ data: orgData }) => {
    return axios.get(`user/${sessionStorage.userIdentifier}`).then(response => {
      store.dispatch({
        type: 'user/userProfile',
        userProfile: { ...response?.data, userOrganizations: orgData },
      });
      return { ...response?.data, userOrganizations: orgData };
    });
  });
}

export function updateStoreWithCurrentUser(cognitoUser) {
  resolvedCognitoUser = cognitoUser;
  sessionStorage.setItem('authUser', JSON.stringify(cognitoUser));
  store.dispatch({ type: 'user/user', user: cognitoUser });
}

export function getUserProfilePic(userIdentifier, pictureType) {
  return axios
    .get(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}?UserPictureType=${pictureType}`,
      { responseType: 'arraybuffer' },
    )
    .then(response => {
      const binaryImage = Buffer.from(response?.data, 'binary').toString(
        'base64',
      );
      const image = `data:${response?.headers[
        'content-type'
      ].toLowerCase()};base64,${binaryImage}`;
      store.dispatch({ type: 'user/userProfilePic', userProfilePic: image });
      return image;
    })
    .catch(() => {
      store.dispatch({
        type: 'user/userProfilePic',
        userProfilePic: undefined,
      });
    });
}

export function saveUserProfilePic(data) {
  return axios
    .post(`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture`, data)
    .then(response => {
      getUserById();
      return response?.data;
    })
    .catch(error => {
      throw error;
    });
}

export function updateUser(formProps) {
  return axios
    .put(`${process.env.HEYDOC_SERVICES_BASE_URL}user`, formProps)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw error;
    });
}

export function deleteUserProfilePic() {
  return axios
    .delete(`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture`)
    .then(response => {
      return response?.data;
    });
}

export function getUserNotificationPrefs() {
  return axios.get('user/userNotificationPreferences').then(response => {
    store.dispatch({
      type: 'user/userNotificationPrefs',
      userNotificationPrefs: response?.data,
    });
    return response?.data;
  });
}

export function updateUserNotoficationPrefs(
  emailNotification,
  pushNotification,
) {
  const notificationPreferences = {
    email: Boolean(emailNotification),
  };

  if (!isNil(pushNotification)) {
    notificationPreferences.push = Boolean(pushNotification);
  }

  return axios
    .put(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/userNotificationPreferences`,
      notificationPreferences,
    )
    .then(response => response?.data)
    .catch(error => {
      throw error;
    });
}

export function leaveList(taskListIdentifier) {
  return axios
    .delete(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/userLeavesList/${taskListIdentifier}`,
    )
    .then(response => {
      onTaskListLeft();
      return response;
    })
    .catch(error => {
      throw error;
    });
}

export function findOrgInviteByEmail(email) {
  return axios
    .get(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/findOrgInviteByEmail/`,
      email,
    )
    .then(response => response?.data)
    .catch(error => {
      throw error;
    });
}

export function getAllSpecialties() {
  return axios
    .get(`${process.env.HEYDOC_SERVICES_BASE_URL}reference/specialties`)
    .then(response => {
      store.dispatch({
        type: 'reference/allSpecialties',
        allSpecialties: response?.data,
      });
      return response?.data;
    });
}

export function getAllTitles() {
  return axios
    .get(`${process.env.HEYDOC_SERVICES_BASE_URL}reference/titles`)
    .then(response => {
      store.dispatch({
        type: 'reference/allTitles',
        allTitles: response?.data,
      });
      return response?.data;
    });
}

export function performHealthCheck() {
  return axios
    .get(`${process.env.HEYDOC_SERVICES_BASE_URL}healthcheck/echo`)
    .then(noop)
    .catch(error => {
      if (!error.response) {
        throw error;
      }
    });
}

export function refreshAccessToken() {
  if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
    return Promise.resolve(null);
  }

  return new Promise(async (resolve, reject) => {
    const cognitoUser = await Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const currentSession = await Auth.currentSession();
    cognitoUser.refreshSession(
      currentSession.refreshToken,
      (error, session) => {
        const { accessToken } = session;
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken.jwtToken}`;
        sessionStorage.setItem('accessToken', accessToken.jwtToken);
        resolve(true);
        if (error) {
          reject(error);
        }
      },
    );
  });
}

export const captureLocalTimezone = async () => {
  const timezoneOffset = new Date().getTimezoneOffset() / 60;
  return axios
    .put(`/user/captureLocalTimezone?timezoneOffset=${timezoneOffset}`, {})
    .then(({ data }) => data);
};

export function getEnterpriseAccessTokensByAuthCode(authCode, iss) {
  return new Promise(async (resolve, reject) => {
    try {
      const authUrl = `${process.env.HEYDOC_SERVICES_BASE_URL}oidc`;
      const authData = `grant_type=authorization_code&code=${authCode}&iss=${iss}`;

      await axios.post(`${authUrl}/token`, authData).then(response => {
        const userRefreshToken = response?.data.refresh_token;
        const userAccessToken = response?.data.access_token;
        const email = response?.data.profile;
        const organizationIdentifier = response?.data.organizationIdentifier;
        const patientIdentifier = response?.data.patientIdentifier;
        sessionStorage.setItem('EnterpriseUserFlag', true);
        sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
        sessionStorage.setItem('SSO_REFRESHTOKEN', userRefreshToken);
        sessionStorage.setItem('SSO_USEREMAIL', email);
        sessionStorage.setItem('accessToken', userAccessToken);

        if (organizationIdentifier && organizationIdentifier !== '') {
          sessionStorage.setItem(
            'OrganizationIdentifier',
            organizationIdentifier,
          );
          sessionStorage.setItem(
            'currentOrganizationIdentifier',
            organizationIdentifier,
          );
        }

        if (patientIdentifier && patientIdentifier !== '') {
          sessionStorage.setItem('PatientIdentifier', patientIdentifier);
        }
        sendEvent({
          eventAction: 'LOGIN_SUCCESS',
          eventCategory: 'AUTH',
          usageEventType: 'USAGE_ACTION',
        });
      });
      await captureLocalTimezone();
      resolve('success');
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
}

export function acknowledgeEula() {
  return axios({
    method: 'put',
    url: '/user/acknowledgeEULA',
  }).then(({ data }) => data);
}

export function updateUserDashboardPrefs(prefs) {
  const currentUser = JSON.parse(sessionStorage.getItem('userProfile'));

  return axios
    .put(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/updateUserPreferences`,
      prefs,
    )
    .then(response => {
      const newCurrentUser = {
        ...currentUser,
        userPreference: {
          ...currentUser?.userPreference,
          ...prefs,
        },
      };
      store.dispatch({ type: 'user/userProfile', userProfile: newCurrentUser });
      sessionStorage.setItem('userProfile', JSON.stringify(newCurrentUser));
      return response?.data;
    })
    .catch(error => {
      throw error;
    });
}

export function selectCurrentOrganization(
  organizationIdentifier,
  redirectToHome = true,
) {
  return axios({
    method: 'put',
    url: `/user/selectOrganization/${organizationIdentifier}`,
  })
    .then(() => {
      sessionStorage.setItem(
        'currentOrganizationIdentifier',
        organizationIdentifier,
      );
      if (redirectToHome) {
        sessionStorage.setItem('redirectToHome', JSON.stringify(true));
      }
      axios.defaults.headers.common.CurrentOrganizationIdentifier = organizationIdentifier;
      window.location.reload();
    })
    .catch(error => {
      throw error;
    });
}

export function selectCurrentOrganizationWithRedirection(
  organizationIdentifier,
  redirectionLink,
) {
  return axios({
    method: 'put',
    url: `/user/selectOrganization/${organizationIdentifier}`,
  })
    .then(() => {
      sessionStorage.setItem(
        'currentOrganizationIdentifier',
        organizationIdentifier,
      );
      sessionStorage.setItem('redirectToLink', redirectionLink);
      axios.defaults.headers.common.CurrentOrganizationIdentifier = organizationIdentifier;
      window.location.reload();
    })
    .catch(error => {
      throw error;
    });
}

export const leaveOrganization = organizationIdentifier =>
  axios
    .delete(`/user/leaveOrganization/${organizationIdentifier}`)
    .then(({ data }) => data);

export const updatePhoneNumber = async (email, existingPhone, newPhone) => {
  const { user } = store.getState().userState;

  // eslint-disable-next-line @typescript-eslint/camelcase
  await Auth.updateUserAttributes(user, { phone_number: `+1${newPhone}` });

  await Auth.verifyUserAttribute(user, 'phone_number');

  return axios.put(`/user/updateMFAPhoneNumber`, {}).then(({ data }) => data);
};

export const verifyNewPhoneNumber = code => {
  const { user } = store.getState().userState;

  return Auth.verifyUserAttributeSubmit(user, 'phone_number', code);
};

export const getUserActiveTasksCount = userId =>
  axios.get(
    `/task/findCountOfAllTasksAssignedToSpecificUser?userId=${userId}&status=INCOMPLETE`,
  );

export const getNotificationSettings = () =>
  axios.get('/user/userNotificationSettings').then(({ data }) => data);

export const updateNotificationSettings = settings =>
  axios
    .put('/user/userNotificationSettings', {
      notificationSettings: settings,
    })
    .then(({ data }) => data);

export const approveOrDenyInvitation = ({
  requestIdentifier,
  decisionType,
  userIdentifier,
}) =>
  axios.put(
    `/invite/request/review/${requestIdentifier}/${decisionType}/${userIdentifier}`,
  );
