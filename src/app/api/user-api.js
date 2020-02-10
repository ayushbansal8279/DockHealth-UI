import configureStore from '../ConfigureStore';
import { onLogin, onLogout } from '../helpers/ga-event-helper';
import { noop } from '../helpers/utility-functions';
import { dummyAccess } from '../reducers/user-reducer';
import axios from './axios-heydoc';

const store = configureStore();

const {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoRefreshToken,
} = window.AWSCognito.CognitoIdentityServiceProvider;

// eslint-disable-next-line import/no-mutable-exports
export let resolvedCognitoUser = null;

window.AWSCognito.config.region = process.env.AWS_REGION;
window.AWSCognito.config.userPoolId = process.env.AWS_USERPOOLID;
// window.AWSCognito.config.identityPoolId = process.env.AWS_IDENTITYPOOLID

const userPool = new CognitoUserPool({
  UserPoolId: process.env.AWS_USERPOOLID,
  ClientId: process.env.AWS_CLIENTAPP,
});

// register a new user
export function register(userData) {
  const attributeList = [];
  const { username: unformattedUsername, password, ...user } = userData;

  const username = unformattedUsername?.toLowerCase();

  Object.keys(user).forEach(userDataKey => {
    const userDataValue = user[userDataKey];

    attributeList.push(
      new CognitoUserAttribute({ Name: userDataKey, Value: userDataValue }),
    );
  });

  return new Promise((resolve, reject) => {
    userPool.signUp(
      username,
      password,
      attributeList,
      null,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolvedCognitoUser = result.user;
          store.dispatch({ type: 'user/user', user: resolvedCognitoUser });

          resolve(result.user);
        }
      },
    );
  });
}

// confirm user registration
export function confirmRegistration(userData) {
  let { username } = userData;
  const { confirmationCode } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  const cognitoUserData = {
    Username: username,
    Pool: userPool,
  };

  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser(cognitoUserData);
    cognitoUser.confirmRegistration(confirmationCode, true, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.user);
      }
    });
  });
}

export function resendConfirmationCode(userData) {
  let { username } = userData;
  if (username) {
    username = username.toLowerCase();
  }

  const cognitoUserData = {
    Username: username,
    Pool: userPool,
  };

  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser(cognitoUserData);
    cognitoUser.resendConfirmationCode((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolvedCognitoUser = result.user;
        resolve(resolvedCognitoUser);
      }
    });
  });
}

export function logout() {
  return new Promise(resolve => {
    const userPoolForAuth = userPool;
    if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
      sessionStorage.removeItem('EnterpriseUserFlag');
      sessionStorage.removeItem('SSO_ACCESSTOKEN');
      sessionStorage.removeItem('SSO_REFRESHTOKEN');
      sessionStorage.removeItem('SSO_USEREMAIL');
      resolve();
    } else {
      const cognitoUser = userPoolForAuth.getCurrentUser();
      if (cognitoUser != null) {
        cognitoUser.signOut();
        resolvedCognitoUser = null;
        store.dispatch({ type: 'user/user', user: resolvedCognitoUser });
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userIdentifier');
        sessionStorage.removeItem('sessionStartTime');
        onLogout();
      }
      resolve();
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
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new window.AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(
      authenticationData,
    );
    const cognitoUserData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(cognitoUserData);
    resolvedCognitoUser = cognitoUser;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        store.dispatch({ type: 'user/user', user: resolvedCognitoUser });
        resolve(result);
      },

      onFailure: reject,

      mfaRequired: codeDeliveryDetails => {
        resolve(codeDeliveryDetails);
      },
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
    const cognitoUser = resolvedCognitoUser;
    cognitoUser.sendMFACode(mfaCode, {
      onSuccess: result => {
        store.dispatch({ type: 'user/user', user: resolvedCognitoUser });
        resolve(result);
      },
      onFailure: reject,
    });
  });
}

export function rememberDevice() {
  return new Promise(resolve => {
    const cognitoUser = resolvedCognitoUser;
    if (cognitoUser != null) {
      cognitoUser.getSession(error => {
        if (!error) {
          cognitoUser.setDeviceStatusRemembered({
            onSuccess: result => {
              resolve(result);
            },
            onFailure: noop,
          });
        }
      });
    }
  });
}

export function isAuthenticated({ isLoggedIn }) {
  if (!isLoggedIn) {
    throw new Error('Callback in isAuthenticated() cannot be null');
  }

  const userPoolForAuth = userPool;

  if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
    const userData = {
      username: sessionStorage.getItem('SSO_USEREMAIL'),
    };

    if (sessionStorage.getItem('SSO_ACCESSTOKEN')) {
      isLoggedIn(true, userData);
      return;
    }

    isLoggedIn(false, userData);
  }

  const cognitoUser = userPoolForAuth.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.getSession((error, session) => {
      if (error) {
        isLoggedIn(false, cognitoUser);
      } else {
        sessionStorage.setItem(
          'accessToken',
          cognitoUser.signInUserSession.accessToken.jwtToken,
        );

        cognitoUser.getUserAttributes(noop);
        isLoggedIn(session.isValid(), cognitoUser);
      }
    });
  } else {
    isLoggedIn(false, cognitoUser);
  }
}

export function forgotPassword(userData) {
  let { username } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  const cognitoUserData = {
    Username: username,
    Pool: userPool,
  };

  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser(cognitoUserData);

    cognitoUser.forgotPassword({
      onSuccess: result => {
        resolve(result.user);
      },
      onFailure: error => {
        reject(error);
      },
      inputVerificationCode: data => {
        resolve(data);
      },
    });
  });
}

export function resetPassword(userData) {
  let { username } = userData;
  const { verificationCode, password } = userData;

  if (username) {
    username = username.toLowerCase();
  }

  const cognitoUserData = {
    Username: username,
    Pool: userPool,
  };

  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser(cognitoUserData);

    cognitoUser.confirmPassword(verificationCode, password, {
      onSuccess: result => {
        resolve(result);
      },
      onFailure: error => {
        reject(error);
      },
    });
  });
}

export function createUser(user) {
  return axios.put('user', user).then(response => {
    store.dispatch({ type: 'user/userIdentifier', userIdentifier: response.data.userIdentifier });
    return response;
  });
}

export function getUserByEmailAndAccessToken(userEmail, accessToken) {
  const authString = 'Bearer '.concat(accessToken);
  axios.defaults.headers.common.Authorization = authString;

  const email = userEmail?.toLowerCase();

  return axios
    .get(
      `${
        process.env.HEYDOC_SERVICES_BASE_URL
      }user/findUserByEmail?email=${encodeURIComponent(email)}`,
    )
    .then(response => {
      store.dispatch({ type: 'user/userProfile', userProfile: response.data });
      sessionStorage.setItem('userIdentifier', response.data.userIdentifier);
      sessionStorage.setItem('userProfile', JSON.stringify(response.data));
      onLogin();
      return { ...response.data, access: dummyAccess };
    });
}

export function getUserByEmail(email, cognitoUser) {
  let accessToken = '';

  if (cognitoUser.signInUserSession) {
    accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;
  }

  if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
    accessToken = sessionStorage.getItem('SSO_ACCESSTOKEN');
  }

  return getUserByEmailAndAccessToken(email, accessToken);
}

export function getUserById() {
  return axios.get(`user/${sessionStorage.userIdentifier}`).then(response => {
    store.dispatch({ type: 'user/userProfile', userProfile: response.data });
    return response.data;
  });
}

export function updateStoreWithCurrentUser(cognitoUser) {
  store.dispatch({ type: 'user/user', user: cognitoUser });
}

export function getUserProfilePic(userIdentifier, pictureType) {
  return axios
    .get(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}?UserPictureType=${pictureType}`,
      { responseType: 'arraybuffer' },
    )
    .then(response => {
      const binaryImage = Buffer.from(response.data, 'binary').toString(
        'base64',
      );
      const image = `data:${response.headers[
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
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function updateUser(formProps) {
  return axios
    .put(`${process.env.HEYDOC_SERVICES_BASE_URL}user`, formProps)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function deleteUserProfilePic() {
  return axios
    .delete(`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture`)
    .then(response => {
      return response.data;
    });
}

export function getUserNotoficationPrefs() {
  return axios.get('user/userNotificationPreferences').then(response => {
    store.dispatch({
      type: 'user/userNotificationPrefs',
      userNotificationPrefs: response.data,
    });
    return response.data;
  });
}

export function updateUserNotoficationPrefs(
  emailNotification,
  pushNotification,
) {
  const notificationPreferences = {
    email: Boolean(emailNotification),
    push: Boolean(pushNotification),
  };

  return axios
    .put(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/userNotificationPreferences`,
      notificationPreferences,
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function leaveList(taskListIdentifier) {
  return axios
    .delete(
      `${process.env.HEYDOC_SERVICES_BASE_URL}user/userLeavesList/${taskListIdentifier}`,
    )
    .then(response => response)
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
    .then(response => response.data)
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
        allSpecialties: response.data,
      });
      return response.data;
    });
}

export function getAllTitles() {
  return axios
    .get(`${process.env.HEYDOC_SERVICES_BASE_URL}reference/titles`)
    .then(response => {
      store.dispatch({ type: 'reference/allTitles', allTitles: response.data });
      return response.data;
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

export function refreshAccessToken(email) {
  if (sessionStorage.getItem('EnterpriseUserFlag') === 'true') {
    const cognitoAuthUrl = process.env.COGNITO_OAUTH_URL;
    return new Promise((resolve, reject) => {
      try {
        const refreshToken = sessionStorage.getItem('SSO_REFRESHTOKEN');
        const authData = `grant_type=refresh_token&refresh_token=${refreshToken}`;
        return axios
          .post(`${cognitoAuthUrl}/oauth2/token`, authData)
          .then(response => {
            const userRefreshToken = response.data.refresh_token;
            const userAccessToken = response.data.access_token;
            const userIDToken = response.data.id_token;
            sessionStorage.setItem('EnterpriseUserFlag', true);
            sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
            sessionStorage.setItem('SSO_IDTOKEN', userIDToken);
            sessionStorage.setItem('SSO_REFRESHTOKEN', userRefreshToken);
            resolve('success');
          });
      } catch (error) {
        reject(error);
        return Promise.reject(error);
      }
    });
  }
  const cognitoUserData = {
    Username: email,
    Pool: userPool,
  };

  const comp = this;

  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser(cognitoUserData);
    cognitoUser.getSession((error, session) => {
      if (error) {
        reject(error);
      } else {
        const currentAccessToken = sessionStorage.getItem('accessToken');
        axios.defaults.headers.common.Authorization = `Bearer ${session.accessToken.jwtToken}`;
        sessionStorage.setItem('accessToken', session.accessToken.jwtToken);
        if (currentAccessToken !== session.accessToken.jwtToken) {
          comp.getUserByEmail(email, cognitoUser);
        }
        resolve(session.isValid());
      }
      sessionStorage.setItem('accessToken', session.accessToken.jwtToken);
      resolve(session.isValid());
    });
  });
}

export function getAccessTokensByAuthCode(authCode) {
  return new Promise((resolve, reject) => {
    try {
      const cognitoAuthUrl = process.env.COGNITO_OAUTH_URL;
      const authData = `grant_type=authorization_code&code=${authCode}`;

      return axios
        .post(`${cognitoAuthUrl}/oauth2/token`, authData)
        .then(response => {
          const userRefreshToken = response.data.refresh_token;
          const userAccessToken = response.data.access_token;
          axios.defaults.headers.common.Authorization = `Bearer ${userAccessToken}`;

          return axios
            .get(`${cognitoAuthUrl}/oauth2/userInfo`)
            .then(cognitoResponse => {
              getUserByEmailAndAccessToken(
                cognitoResponse.data.email,
                userAccessToken,
              );

              sessionStorage.setItem('EnterpriseUserFlag', true);

              const cognitoUserData = {
                Username: cognitoResponse.data.email,
                Pool: userPool,
              };

              const cognitoUser = new CognitoUser(cognitoUserData);
              const refreshToken = new CognitoRefreshToken({
                RefreshToken: userRefreshToken,
              });

              cognitoUser.refreshSession(refreshToken, error => {
                if (error) {
                  reject(error);
                } else {
                  resolve('success');
                }
              });
            });
        });
    } catch (error) {
      reject(error);
      return Promise.reject(error);
    }
  });
}

export function getEnterpriseAccessTokensByAuthCode(authCode) {
  return new Promise((resolve, reject) => {
    try {
      const authUrl = `${process.env.HEYDOC_SERVICES_BASE_URL}oidc`;
      const authData = `grant_type=authorization_code&code=${authCode}`;

      return axios.post(`${authUrl}/token`, authData).then(response => {
        const userRefreshToken = response.data.refresh_token;
        const userAccessToken = response.data.access_token;
        const email = response.data.profile;
        sessionStorage.setItem('EnterpriseUserFlag', true);
        sessionStorage.setItem('SSO_ACCESSTOKEN', userAccessToken);
        sessionStorage.setItem('SSO_REFRESHTOKEN', userRefreshToken);
        sessionStorage.setItem('SSO_USEREMAIL', email);
        resolve('success');
      });
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
