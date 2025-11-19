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
import { log } from 'helpers/log';
import configureStore from '../ConfigureStore';
import axios from './axios-heydoc';
import sendEvent from './usage-api';
import { userLogout } from './user-api';

const store = configureStore();

// eslint-disable-next-line import/no-mutable-exports
export let resolvedCognitoUser = null;

// Store authenticated user details after cookie-based authentication
// This is populated after successful token exchange and user details fetch
let authenticatedUserDetails = null;

// In-memory storage adapter - data is stored only in memory and cleared on page refresh
const inMemoryStorage = (() => {
  const storage = {};

  return {
    getItem: (key) => {
      return storage[key] || null;
    },
    setItem: (key, value) => {
      storage[key] = value;
    },
    removeItem: (key) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach((key) => {
        delete storage[key];
      });
    },
  };
})();

const selectiveStorage = (() => {
  let memoryStorage = {};

  return {
    getItem: (key) => {
      if (key.includes('deviceKey') 
        || key.includes('deviceGroupKey')
        || key.includes('randomPasswordKey')
        || key.includes('clockDrift')
        || key.includes('LastAuthUser')) {
        return localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    },
    setItem: (key, value) => {
      // Store device keys in localStorage
      if (key.includes('deviceKey') 
        || key.includes('deviceGroupKey')
        || key.includes('randomPasswordKey')
        || key.includes('clockDrift')
        || key.includes('LastAuthUser')) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
      delete memoryStorage[key];
    },
    clear: () => {
      localStorage.clear();
      Object.keys(memoryStorage).forEach((key) => {
        delete memoryStorage[key];
      });
      memoryStorage = {};
    },
  };
})();

Amplify.configure({
  // To get the AWS Credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_AWS_USERPOOLID,
    userPoolWebClientId: import.meta.env.VITE_AWS_CLIENTAPP,
    authenticationFlowType: 'USER_SRP_AUTH',
    storage: selectiveStorage,
  },
});

// register a new user
export function register(userData) {
  const attributes = {};

  const { username: unformattedUsername, password, ...user } = userData;

  const username = unformattedUsername?.toLowerCase();

  for (const userDataKey of Object.keys(user)) {
    const userDataValue = user[userDataKey];
    attributes[userDataKey] = userDataValue;
  }

  return new Promise((resolve, reject) => {
    Auth.signUp({
      username,
      password,
      attributes,
      validationData: [], // optional
    })
      .then((data) => {
        resolvedCognitoUser = data.user;
        store.dispatch({
          type: GET_USER_AUTH_DATA_SUCCESS,
          userAuth: data.user,
        });
        resolve(data.user);
      })
      .catch((error) => {
        log(error);
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
      .then((data) => {
        resolve(data.user);
      })
      .catch((error) => {
        log(error);
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
      .then((data) => {
        resolvedCognitoUser = data.user;
        resolve(data.user);
      })
      .catch((error) => {
        log(error);
        reject(error);
      });
  });
}

export function changePassword(oldPassword, newPassword) {
  const { userAuth } = store.getState().userState;
  return Auth.changePassword(userAuth, oldPassword, newPassword);
}

/**
 * Check if secure cookie is available by making a lightweight request
 * @returns {Promise<boolean>} Promise that resolves to true if cookie is available, false otherwise
 */
async function isSecureCookieAvailable() {
  try {
    // Make a lightweight HEAD request to check if cookie is valid
    // This avoids fetching full user details if cookie is not available
    await axios.head('user/me', {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    // If the request fails (401, 403, etc.), cookie is not available or invalid
    return false;
  }
}

/**
 * Fetch authenticated user details using HTTPOnly cookie
 * @returns {Promise} Promise that resolves with user details
 */
async function fetchAuthenticatedUserDetails() {
  try {
    // Fetch user details using the HTTPOnly cookie
    // The cookie is automatically sent via withCredentials: true in axios config
    const response = await axios.get('user/me', {
      withCredentials: true,
    });
    
    if (response.data) {
      authenticatedUserDetails = response.data;
      return response.data;
    }
    
    throw new Error('No user data returned from auth/me endpoint');
  } catch (error) {
    log('Failed to fetch authenticated user details:', error);
    authenticatedUserDetails = null;
    throw error;
  }
}

/**
 * Exchange Cognito access token for HTTPOnly cookie and fetch user details
 * @param {string} accessToken - The Cognito access token
 * @returns {Promise} Promise that resolves when cookie is set and user details are fetched
 */
export function exchangeTokenForCookie(accessToken) {
  return new Promise((resolve, reject) => {
    // Use a temporary axios instance with credentials enabled for this request
    // The cookie will be set by the backend and automatically included in future requests
    axios
      .post(
        'auth/exchangeToken',
        { accessToken },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            // Temporarily use Bearer token for this exchange request
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then(async () => {
        // Token successfully exchanged, cookie is now set
        
        // Fetch and store user details using the newly set cookie
        try {
          await fetchAuthenticatedUserDetails();
          resolve();
        } catch (error) {
          log('Token exchange succeeded but user details fetch failed:', error);
          resolve();
        }
      })
      .catch((error) => {
        log(error);
        authenticatedUserDetails = null;
        reject(error);
      });
  });
}

export function logout(history) {
  onLogout();
  userLogout();
  window.sessionStorage.removeItem('confirmStatus');
  history.replace('/auth/login');

  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
      sessionStorage.removeItem('EnterpriseUserFlag');
      sessionStorage.removeItem('SSO_ACCESSTOKEN');
      sessionStorage.removeItem('SSO_USEREMAIL');
      // Clear authenticated user details
      authenticatedUserDetails = null;
      // Clear cookie via backend
      axios
        .post('auth/logout', {}, { withCredentials: true })
        .catch((error) => {
          log(error);
          // Continue with logout even if cookie clearing fails
        })
        .finally(() => {
          resolve();
        });
    } else {
      // Clear cookie via backend first
      axios
        .post('auth/logout', {}, { withCredentials: true })
        .catch((error) => {
          log(error);
          // Continue with logout even if cookie clearing fails
        })
        .finally(() => {
          Auth.signOut()
            .then(() => {
              resolvedCognitoUser = null;
              store.dispatch({ type: GET_USER_AUTH_DATA_SUCCESS, userAuth: null });
              store.dispatch({ type: RESET_APP });
              sessionStorage.removeItem('accessToken');
              sessionStorage.removeItem('userIdentifier');
              sessionStorage.removeItem('sessionStartTime');
              sessionStorage.removeItem('currentOrganizationIdentifier');
              sessionStorage.removeItem('notificationsEnabled');
              sessionStorage.removeItem('hasUnreadAlerts');
              sessionStorage.removeItem('redirectToHome');
              sessionStorage.removeItem('redirectToLink');
              sessionStorage.removeItem('selectedTaskIdentifier');
              inMemoryStorage.removeItem('authUser');
              // Clear authenticated user details
              authenticatedUserDetails = null;
              resolve();
            })
            .catch((error) => {
              log(error);
              reject(error);
            });
        });
    }
  });
}

export function login(loginUserName, password) {
  const username = loginUserName?.toLowerCase();

  sessionStorage.removeItem('EnterpriseUserFlag');
  sessionStorage.removeItem('SSO_ACCESSTOKEN');
  sessionStorage.removeItem('SSO_USEREMAIL');
  return new Promise((resolve, reject) => {
    Auth.signIn({
      username, // Required, the username
      password, // Optional, the password
    })
      .then((userAuth) => {
        resolvedCognitoUser = userAuth;
        if (
          userAuth.challengeName === 'SMS_MFA' ||
          userAuth.challengeName === 'SOFTWARE_TOKEN_MFA'
        ) {
          resolve(userAuth);
        } else {
          store.dispatch({ type: GET_USER_AUTH_DATA_SUCCESS, userAuth });
          const accessToken = userAuth.signInUserSession.accessToken.jwtToken;
          
          // Exchange Cognito token for HTTPOnly cookie
          exchangeTokenForCookie(accessToken)
            .then(() => {
              sendEvent({
                eventAction: 'LOGIN_SUCCESS',
                eventCategory: 'AUTH',
                usageEventType: 'USAGE_ACTION',
              });
              resolve(userAuth);
            })
            .catch((error) => {
              log(error);
              sendEvent({
                eventAction: 'LOGIN_SUCCESS',
                eventCategory: 'AUTH',
                usageEventType: 'USAGE_ACTION',
              });
              resolve(userAuth);
            });
        }
      })
      .catch((error) => {
        log(error);
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
      .then((loggedUser) => {
        resolvedCognitoUser = loggedUser;
        store.dispatch({
          type: GET_USER_AUTH_DATA_SUCCESS,
          userAuth: loggedUser,
        });
        const accessToken = loggedUser.signInUserSession.accessToken.jwtToken;
        
        // Exchange Cognito token for HTTPOnly cookie
        exchangeTokenForCookie(accessToken)
          .then(() => {
            sendEvent({
              eventAction: 'LOGIN_SUCCESS',
              eventCategory: 'AUTH',
              usageEventType: 'USAGE_ACTION',
            });
            resolve(loggedUser);
          })
          .catch((error) => {
            log(error);
            // If exchange fails, still resolve with loggedUser but log the error
            // The user can still proceed, but Bearer token will be used as fallback
            sendEvent({
              eventAction: 'LOGIN_SUCCESS',
              eventCategory: 'AUTH',
              usageEventType: 'USAGE_ACTION',
            });
            resolve(loggedUser);
          });
      })
      .catch((error) => {
        log(error);
        reject(error);
      });
  });
}

export function rememberDevice() {
  return new Promise((resolve) => {
    Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        user.getCachedDeviceKeyAndPassword(); // without this line, the deviceKey is null
        user.setDeviceStatusRemembered({
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: noop,
        });
      })
      .catch((error) => {
        log(error);
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

  // First, check if we have authenticated user details from cookie-based auth
  if (authenticatedUserDetails) {
    return { isLoggedIn: true, user: authenticatedUserDetails };
  }

  // Check if secure cookie is available before attempting to fetch user details
  const cookieAvailable = await isSecureCookieAvailable();
  if (!cookieAvailable) {
    log('Secure cookie is not available');
  } else {
    // Cookie is available, try to fetch user details
    try {
      const userDetails = await fetchAuthenticatedUserDetails();
      return { isLoggedIn: true, user: userDetails };
    } catch (cookieError) {
      // Cookie-based auth failed, fall back to Cognito authentication
      log('Cookie-based authentication failed', cookieError);
    }
  }

  try {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false,
    });
    const authData = await Auth.currentSession();
    const accessToken = authData.accessToken.jwtToken;

    // If we have a Cognito token but no cookie, exchange it
    if (accessToken) {
      try {
        await exchangeTokenForCookie(accessToken);
        // After successful exchange, user details should be stored
        if (authenticatedUserDetails) {
          return { isLoggedIn: true, user: authenticatedUserDetails };
        }
      } catch (exchangeError) {
        log('Token exchange failed:', exchangeError);
        return { isLoggedIn: false, user: null };
      }
    }

    return { isLoggedIn: true, user };
  } catch (cognitoError) {
    log('Cognito authentication failed:', cognitoError);
    // No valid cookie and no valid Cognito session
    authenticatedUserDetails = null;
    return { isLoggedIn: false, user: null };
  }
}

export function isUserAlreadyAuthenticated() {
  return authenticatedUserDetails !== null;
}

export function forgotPassword(userData) {
  let { username } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  return new Promise((resolve, reject) => {
    Auth.forgotPassword(username)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        log(error);
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
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        log(error);
        reject(error);
      });
  });
}

export function getUserByEmailAndAccessToken(userEmail, accessToken) {
  // Only set Bearer token if accessToken is provided and we're not using cookies
  // For cookie-based auth, the cookie will be sent automatically via withCredentials
  if (accessToken) {
    const authString = 'Bearer '.concat(accessToken);
    axios.defaults.headers.common.Authorization = authString;
  }

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
          .catch((error) => {
            store.dispatch({
              type: GET_CURRENT_USER_ORGANIZATIONS_FAILURE,
            });
            reject(error);
          });
      })
      .catch((error) => {
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
  inMemoryStorage.setItem('authUser', JSON.stringify(cognitoUser));
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
      async (error, session) => {
        if (error) {
          reject(error);
          return;
        }
        
        const { accessToken } = session;
        sessionStorage.setItem('accessToken', accessToken.jwtToken);
        resolve(true);
      },
    );
  });
}

export function getEnterpriseAccessTokensByAuthCode(authCode, iss) {
  // eslint-disable-next-line consistent-return
  return new Promise(async (resolve, reject) => {
    try {
      const authUrl = `${import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL}oidc`;
      const authData = `grant_type=authorization_code&code=${authCode}&iss=${iss}`;

      await axios.post(`${authUrl}/token`, authData).then((response) => {
        const userAccessToken = response?.data.access_token;
        const email = response?.data.profile;
        const organizationIdentifier = response?.data.organizationIdentifier;
        const patientIdentifier = response?.data.patientIdentifier;
        sessionStorage.setItem('EnterpriseUserFlag', true);
        sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
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
        } catch {
          // do nothing
        }
      });
      try {
        await UserApi.captureLocalTimezone();
      } catch (error) {
        log(error);
      }
      resolve('success');
    } catch (error) {
      reject(error);
      // eslint-disable-next-line no-promise-executor-return, unicorn/no-useless-promise-resolve-reject
      return Promise.reject(error);
    }
  });
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function getEnterpriseAccessTokensForEmbeddedSSO(
  authToken,
  userIdentifier,
  targetType,
  targetIdentifier,
  orgIdentifier,
) {
  if (orgIdentifier && orgIdentifier !== '') {
    sessionStorage.setItem('currentOrganizationIdentifier', orgIdentifier);
  }
  // eslint-disable-next-line consistent-return, sonarjs/cognitive-complexity
  return new Promise(async (resolve, reject) => {
    try {
      const authUrl = `${import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL}oidc`;
      const authData = `authToken=${authToken}&userIdentifier=${userIdentifier}&targetType=${targetType}&targetIdentifier=${targetIdentifier}&organizationIdentifier=${orgIdentifier}`;

      await axios
        .post(`${authUrl}/embeddedToken`, authData)
        .then((response) => {
          const userAccessToken = response?.data.access_token;
          const email = response?.data.profile;
          const organizationIdentifier = response?.data.organizationIdentifier;
          const patientIdentifier = response?.data.patientIdentifier;
          const taskListIdentifier = response?.data.taskListIdentifier;
          const taskIdentifier = response?.data.taskIdentifier;
          sessionStorage.setItem('EnterpriseUserFlag', true);
          sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
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
          } catch {
            // do nothing
          }
        });
      try {
        await UserApi.captureLocalTimezone();
      } catch (error) {
        log(error);
      }
      resolve('success');
    } catch (error) {
      reject(error);
      // eslint-disable-next-line no-promise-executor-return, unicorn/no-useless-promise-resolve-reject
      return Promise.reject(error);
    }
  });
}

export const getFHIREnterpriseAccessTokensByAuthCode = (
  authCode,
  requestAuthTokenURL,
) => {
  return new Promise((resolve, reject) => {
    try {
      const authData = `grant_type=authorization_code&code=${authCode}`;

      return axios.post(requestAuthTokenURL, authData).then((response) => {
        const userAccessToken = response?.data.access_token;
        const email = response?.data.profile;
        const userIdentifier = response?.data.userIdentifier;
        const patientIdentifier = response?.data.patientIdentifier;
        sessionStorage.setItem('EnterpriseUserFlag', true);
        sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
        sessionStorage.setItem('SSO_USEREMAIL', email);
        sessionStorage.setItem('userIdentifier', userIdentifier);
        sessionStorage.setItem('patientIdentifier', patientIdentifier);
        sessionStorage.setItem('accessToken', userAccessToken);
        resolve('success');
      });
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
};

export const getFHIREnterpriseAccessTokensByRefreshToken = (
  refreshToken,
  requestAuthTokenURL,
) => {
  return new Promise((resolve, reject) => {
    try {
      const authData = `grant_type=refresh_token&refresh_token=${refreshToken}`;

      return axios.post(requestAuthTokenURL, authData).then((response) => {
        const userAccessToken = response?.data.access_token;
        const email = response?.data.profile;
        const userIdentifier = response?.data.userIdentifier;
        const patientIdentifier = response?.data.patientIdentifier;
        sessionStorage.setItem('EnterpriseUserFlag', true);
        sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
        sessionStorage.setItem('SSO_USEREMAIL', email);
        sessionStorage.setItem('userIdentifier', userIdentifier);
        sessionStorage.setItem('patientIdentifier', patientIdentifier);
        sessionStorage.setItem('accessToken', userAccessToken);
        resolve('success');
      });
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
};

export const getCustomLaunchEnterpriseAccessTokensByAuthCode = (
  authData,
  requestAuthTokenURL,
) => {
  return new Promise((resolve, reject) => {
    try {
      // const authUrl = `${import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL}/launch/drchrono`;

      return axios.post(requestAuthTokenURL, authData).then((response) => {
        const userAccessToken = response?.data.access_token;
        const email = response?.data.profile;
        const userIdentifier = response?.data.userIdentifier;
        const patientIdentifier = response?.data.patientIdentifier;
        sessionStorage.setItem('EnterpriseUserFlag', true);
        sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
        sessionStorage.setItem('SSO_USEREMAIL', email);
        sessionStorage.setItem('userIdentifier', userIdentifier);
        sessionStorage.setItem('patientIdentifier', patientIdentifier);
        sessionStorage.setItem('accessToken', userAccessToken);
        resolve('success');
      });
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
};

export const updatePhoneNumber = async (email, existingPhone, newPhone) => {
  const { userAuth } = store.getState().userState;

  await Auth.updateUserAttributes(userAuth, { phone_number: `${newPhone}` });

  await Auth.verifyUserAttribute(userAuth, 'phone_number');
};

export const verifyNewPhoneNumber = async (code) => {
  const { userAuth } = store.getState().userState;

  await Auth.verifyUserAttributeSubmit(userAuth, 'phone_number', code);
  return axios.put(`/user/updateMFAPhoneNumber`, {}).then(({ data }) => data);
};

export function checkSSO(email) {
  // eslint-disable-next-line consistent-return
  return new Promise(async (resolve) => {
    try {
      const checkSSOUrl = `${
        import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
      }auth/checkSSO`;
      const response = await axios.get(
        `${checkSSOUrl}?email=${encodeURIComponent(email)}`, { withCredentials: false },
      );
      const issuer = response?.data.issuer;
      log(`issuer: ${issuer}`);
      resolve(issuer);
    } catch (error) {
      log(error);
      resolve('');
    }
  });
}
