/* eslint-disable no-async-promise-executor */
// eslint-disable-next-line import/no-extraneous-dependencies
import Amplify from '@aws-amplify/core';
import { onLogin, onLogout } from 'helpers/ga-event-helper';
import { getCurrentUserOrganizations } from 'api/organization-api';
import {
  RESET_APP,
  GET_USER_AUTH_DATA_SUCCESS,
  INITIALIZE_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_ORGANIZATIONS_SUCCESS,
  GET_CURRENT_USER_ORGANIZATIONS_FAILURE,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAILURE,
} from 'actions/action-types';
import * as UserApi from 'api/user-api';
import { noop, showAlert } from 'helpers/utility-functions';
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
    authenticationFlowType: 'USER_SRP_AUTH',
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
        resolvedCognitoUser = data.user;
        store.dispatch({
          type: GET_USER_AUTH_DATA_SUCCESS,
          userAuth: data.user,
        });
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
  const { userAuth } = store.getState().userState;
  return Auth.changePassword(userAuth, oldPassword, newPassword);
}

export function logout(history) {
  onLogout();
  window.sessionStorage.removeItem('confirmStatus');
  history.replace('/auth/login');

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
          store.dispatch({ type: GET_USER_AUTH_DATA_SUCCESS, userAuth: null });
          store.dispatch({ type: RESET_APP });
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('userIdentifier');
          sessionStorage.removeItem('authUser');
          sessionStorage.removeItem('sessionStartTime');
          sessionStorage.removeItem('currentOrganizationIdentifier');
          sessionStorage.removeItem('notificationsEnabled');
          sessionStorage.removeItem('hasUnreadAlerts');
          sessionStorage.removeItem('redirectToHome');
          sessionStorage.removeItem('redirectToLink');
          sessionStorage.removeItem('selectedTaskIdentifier');
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
      .then(userAuth => {
        resolvedCognitoUser = userAuth;
        if (
          userAuth.challengeName === 'SMS_MFA' ||
          userAuth.challengeName === 'SOFTWARE_TOKEN_MFA'
        ) {
          resolve(userAuth);
        } else {
          store.dispatch({ type: GET_USER_AUTH_DATA_SUCCESS, userAuth });
          sessionStorage.setItem(
            'accessToken',
            userAuth.signInUserSession.accessToken.jwtToken,
          );
          sendEvent({
            eventAction: 'LOGIN_SUCCESS',
            eventCategory: 'AUTH',
            usageEventType: 'USAGE_ACTION',
          });
          resolve(userAuth);
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
        store.dispatch({
          type: GET_USER_AUTH_DATA_SUCCESS,
          userAuth: loggedUser,
        });
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

export function getUserByEmailAndAccessToken(userEmail, accessToken) {
  const authString = 'Bearer '.concat(accessToken);
  axios.defaults.headers.common.Authorization = authString;

  const email = userEmail?.toLowerCase();

  return new Promise((resolve, reject) => {
    Promise.all([UserApi.getUserByEmail(email)])
      .then(([user]) => {
        store.dispatch({
          type: INITIALIZE_CURRENT_USER_REQUEST,
        });
        store.dispatch({
          type: GET_CURRENT_USER_SUCCESS,
          user,
        });
        sessionStorage.setItem('userIdentifier', user?.userIdentifier);
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
            user?.organizationIdentifier,
          );
          axios.defaults.headers.common.CurrentOrganizationIdentifier =
            user?.organizationIdentifier;
        }
        onLogin();
        Promise.all([getCurrentUserOrganizations()])
          .then(([organizations]) => {
            store.dispatch({
              type: GET_CURRENT_USER_ORGANIZATIONS_SUCCESS,
              organizations,
            });
            const userProfile = {
              ...user,
              userOrganizations: organizations,
            };
            resolve({ ...userProfile, access: dummyAccess });
          })
          .catch(error => {
            store.dispatch({
              type: GET_CURRENT_USER_ORGANIZATIONS_FAILURE,
            });
            reject(error);
          });
      })
      .catch(error => {
        store.dispatch({
          type: GET_CURRENT_USER_FAILURE,
        });
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.response?.data?.error ??
            'Error authentication. Please try again.',
        });
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

export function updateStoreWithCurrentUser(cognitoUser) {
  resolvedCognitoUser = cognitoUser;
  sessionStorage.setItem('authUser', JSON.stringify(cognitoUser));
  store.dispatch({ type: GET_USER_AUTH_DATA_SUCCESS, userAuth: cognitoUser });
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

export function getEnterpriseAccessTokensByAuthCode(authCode, iss) {
  // eslint-disable-next-line consistent-return
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
        try {
          sendEvent({
            eventAction: 'LOGIN_SUCCESS',
            eventCategory: 'AUTH',
            usageEventType: 'USAGE_ACTION',
          });
        } catch (error) {
          // do nothing
        }
      });
      try {
        await UserApi.captureLocalTimezone();
      } catch (error) {
        console.log(error);
      }
      resolve('success');
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
}

export function getEnterpriseAccessTokensForEmbeddedSSO(
  authToken,
  userIdentifier,
  targetType,
  targetIdentifier,
) {
  // eslint-disable-next-line consistent-return, sonarjs/cognitive-complexity
  return new Promise(async (resolve, reject) => {
    try {
      const authUrl = `${process.env.HEYDOC_SERVICES_BASE_URL}oidc`;
      const authData = `authToken=${authToken}&userIdentifier=${userIdentifier}&targetType=${targetType}&targetIdentifier=${targetIdentifier}`;

      await axios.post(`${authUrl}/embeddedToken`, authData).then(response => {
        const userRefreshToken = response?.data.refresh_token;
        const userAccessToken = response?.data.access_token;
        const email = response?.data.profile;
        const organizationIdentifier = response?.data.organizationIdentifier;
        const patientIdentifier = response?.data.patientIdentifier;
        const taskListIdentifier = response?.data.taskListIdentifier;
        const taskIdentifier = response?.data.taskIdentifier;
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
        if (taskListIdentifier && taskListIdentifier !== '') {
          sessionStorage.setItem('TaskListIdentifier', taskListIdentifier);
        }
        if (taskIdentifier && taskIdentifier !== '') {
          sessionStorage.setItem('TaskIdentifier', taskIdentifier);
        }
        try {
          sendEvent({
            eventAction: 'LOGIN_SUCCESS',
            eventCategory: 'AUTH',
            usageEventType: 'USAGE_ACTION',
          });
        } catch (error) {
          // do nothing
        }
      });
      try {
        await UserApi.captureLocalTimezone();
      } catch (error) {
        console.log(error);
      }
      resolve('success');
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
}

export const updatePhoneNumber = async (email, existingPhone, newPhone) => {
  const { userAuth } = store.getState().userState;

  // eslint-disable-next-line @typescript-eslint/camelcase
  await Auth.updateUserAttributes(userAuth, { phone_number: `${newPhone}` });

  await Auth.verifyUserAttribute(userAuth, 'phone_number');

  return axios.put(`/user/updateMFAPhoneNumber`, {}).then(({ data }) => data);
};

export const verifyNewPhoneNumber = code => {
  const { userAuth } = store.getState().userState;

  return Auth.verifyUserAttributeSubmit(userAuth, 'phone_number', code);
};

export function checkSSO(email) {
  // eslint-disable-next-line consistent-return
  return new Promise(async resolve => {
    try {
      const checkSSOUrl = `${process.env.HEYDOC_SERVICES_BASE_URL}auth/checkSSO`;
      const response = await axios.get(`${checkSSOUrl}?email=${email}`);
      const issuer = response?.data.issuer;
      console.log(`issuer: ${issuer}`);
      resolve(issuer);
    } catch (error) {
      console.log(error);
      resolve('');
    }
  });
}
