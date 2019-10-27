import axios from './axios-heydoc';
import configureStore from '../configureStore'
const store = configureStore();

const {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} = window.AWSCognito.CognitoIdentityServiceProvider

export let resolvedCognitoUser = null

window.AWSCognito.config.region = process.env.AWS_REGION
window.AWSCognito.config.userPoolId = process.env.AWS_USERPOOLID
// window.AWSCognito.config.identityPoolId = process.env.AWS_IDENTITYPOOLID

const userPool = new CognitoUserPool({
  UserPoolId: process.env.AWS_USERPOOLID,
  ClientId: process.env.AWS_CLIENTAPP
})

// register a new user
export function register (userData) {
  const attributeList = []
  let {username, password, ...user} = userData
  if(username){
    username = username.toLowerCase()
  }
  for (let field in user) {
    attributeList.push(new CognitoUserAttribute({ Name: field, Value: user[field] }))
  }
  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) return reject(err)
      resolvedCognitoUser = result.user
      store.dispatch({type: 'user/user', user: resolvedCognitoUser})
      //enable MFA
      /*
      resolvedCognitoUser.enableMFA(function(err, result) {
        if (err) {
            //alert(err);
            return;
        }
        console.log('enabled MFA: ' + result);
      });
      */

      resolve(result.user)
    })
  })
}

// confirm user registration
export function confirmRegistration (userData) {
  const attributeList = []
  let {username, confirmationCode} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
        if (err) {
            return reject(err)
        } else {
          /*
            console.log('creating heydoc user');
            createUser({
              firstName: "Test",
              lastName: "Test",
              email: cognitoUser.username
            })
          */
            resolve(result.user)
        }
    })
  })
}

// resend code
export function resendConfirmationCode (userData) {
  const attributeList = []
  let {username} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
            return reject(err)
        } else {
            resolvedCognitoUser = result.user
            //store.dispatch({type: 'user/user', user: resolvedCognitoUser})
            resolve(resolvedCognitoUser)
        }
    })
  })
}

// log user out
export function logout () {
  return new Promise((resolve, reject) => {
    var userPoolForAuth = userPool
    if(window.sessionStorage.getItem("EnterpriseUserFlag") == "true"){
      // userPoolForAuth = userPoolAlternate
        window.sessionStorage.removeItem("EnterpriseUserFlag")
        window.sessionStorage.removeItem("SSO_ACCESSTOKEN")
        window.sessionStorage.removeItem("SSO_REFRESHTOKEN")
        window.sessionStorage.removeItem("SSO_USEREMAIL")
        resolve();
    }else{
      let cognitoUser = userPoolForAuth.getCurrentUser();
      if(cognitoUser != null){
        cognitoUser.signOut()
        resolvedCognitoUser = null
        store.dispatch({type: 'user/user', user: resolvedCognitoUser})
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('sessionStartTime');
      }
      resolve();
    }
  })
}

// authenticate user, and also ask for MFA or verification code, if needed
export function login (username, password) {
  if(username){
    username = username.toLowerCase()
  }
  window.sessionStorage.removeItem("EnterpriseUserFlag")
  window.sessionStorage.removeItem("SSO_ACCESSTOKEN")
  window.sessionStorage.removeItem("SSO_REFRESHTOKEN")
  window.sessionStorage.removeItem("SSO_USEREMAIL")
  return new Promise((resolve, reject) => {
    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new window.AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var cognitoUserData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(cognitoUserData)
    resolvedCognitoUser = cognitoUser
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken())

        store.dispatch({type: 'user/user', user: resolvedCognitoUser})
        resolve(result)
        /*
        var logins = {}
        logins['cognito-idp.' + window.AWSCognito.config.region + '.amazonaws.com/' + userPool.userPoolId] = result.getIdToken().getJwtToken();

        // Add the User's Id Token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: window.AWSCognito.config.identityPoolId,
            Logins: logins
        });

        AWS.config.credentials.get(function (err) {
            if (!err) {
                var id = AWS.config.credentials.identityId;
                console.log(AWS.config.credentials)
            }
        });

        console.log("set the AWS credentials - " + JSON.stringify(AWS.config.credentials));
        console.log("set the AWSCognito credentials - " + JSON.stringify(AWSCognito.config.credentials));
        */
      },

      onFailure: reject,

      mfaRequired: function(codeDeliveryDetails) {
          // MFA is required to complete user authentication.
          // Get the code from user and call
          console.log("MFA code is needed")
          resolve(codeDeliveryDetails)
      }
    })
  })
}

// confirm user registration
export function sendMFACode (userData) {
  const attributeList = []
  let {username, mfaCode} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = resolvedCognitoUser //ensure we use the same cognitoUser object from authenicate call since it needs the session to be initialized
    cognitoUser.sendMFACode(mfaCode, {
      onSuccess: function (result, userConfirmationNecessary) {
        console.log('access token + ' + result.getAccessToken().getJwtToken())

        store.dispatch({type: 'user/user', user: resolvedCognitoUser})
        resolve(result)

      },
      onFailure: reject
    })
  })
}

//remember the device
export function rememberDevice () {
  return new Promise((resolve, reject) => {
    var cognitoUser = resolvedCognitoUser //ensure we use the same cognitoUser object so the deviceKey is set from the localstorage
    if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false, cognitoUser);
                }
                else {
                    console.log("Session is " + session.isValid());
                    cognitoUser.setDeviceStatusRemembered({
                        onSuccess: function (result) {
                            console.log('call result: ' + result);
                            resolve(result)
                        },
                        onFailure: function(err) {
                            //alert(err);
                        }
                    })
                }
            })
    }
  })
}


export function isAuthenticated (callback) {
  if (callback == null)
      throw("Callback in isAuthenticated() cannot be null");
  var userPoolForAuth = userPool
  if(window.sessionStorage.getItem("EnterpriseUserFlag") == "true"){
    // userPoolForAuth = userPoolAlternate
    var userData = {
      username: window.sessionStorage.getItem("SSO_USEREMAIL")
    }
    if(window.sessionStorage.getItem("SSO_ACCESSTOKEN") != undefined){
      callback.isLoggedIn("", true, userData);
      return
    }else{
      console.log("User is not logged in");
      callback.isLoggedIn("User is not logged in", false, userData);
    }
  }
  let cognitoUser = userPoolForAuth.getCurrentUser();
  //console.log('cognitoUser: '+JSON.stringify(cognitoUser))
  if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
          if (err) {
              console.log("Couldn't get the session: " + err, err.stack);
              callback.isLoggedIn(err, false, cognitoUser);
          }
          else {
              console.log("Session is " + session.isValid());
              sessionStorage.setItem('accessToken', cognitoUser.signInUserSession.accessToken.jwtToken);
              //sessionStorage.setItem('refreshToken', cognitoUser.signInUserSession.refreshToken.token);
              // NOTE: getSession must be called to authenticate user before calling getUserAttributes
              cognitoUser.getUserAttributes(function(err, attributes) {
                  if (err) {
                      // Handle error
                  } else {
                      // Do something with attributes
                  }
              });

              callback.isLoggedIn(err, session.isValid(), cognitoUser);
          }
      });
  } else {
      console.log("Can't retrieve the current user");
      callback.isLoggedIn("Can't retrieve the CurrentUser", false, cognitoUser);
  }
}

export function forgotPassword (userData) {
  const attributeList = []
  let {username} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
          resolve(result.user)
          //callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
          console.log(err);
          return reject(err)
          //callback.cognitoCallback(err.message, null);
      },
      inputVerificationCode: function(data) {
          console.log('Code sent to: ' + data.CodeDeliveryDetails.Destination);
          resolve(data)
          //callback.cognitoCallback(null, null);
          // console.log('Code sent to: ' + data);
          // var verificationCode = prompt('Please input verification code ' ,'');
          // var newPassword = prompt('Enter new password ' ,'');
          // cognitoUser.confirmPassword(verificationCode, newPassword, this);
      }
    });
  });

}

export function resetPassword (userData) {
  const attributeList = []
  let {username, verificationCode, password} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.confirmPassword(verificationCode, password, {
      onSuccess: function (result) {
          resolve(result)
          //callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
          console.log(err);
          return reject(err)
          //callback.cognitoCallback(err.message, null);
      }
    });
  });

}

export function createUser(user) {
  return axios.put('user', user)
    .then(response => {
      store.dispatch({type: 'user/userId', userId: response.data.userId})
      return response;
    });
}

export function getUserByEmail(email, cognitoUser) {
  var accessToken = ""
  if(cognitoUser.signInUserSession){
    accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;
  }
  if(window.sessionStorage.getItem("EnterpriseUserFlag") == "true"){
    accessToken = window.sessionStorage.getItem("SSO_ACCESSTOKEN");
  }
  return getUserByEmailAndAccessToken(email, accessToken)
}

export function getUserByEmailAndAccessToken(email, accessToken) {
  const authString = 'Bearer '.concat(accessToken);
  //sets global header for axios
  axios.defaults.headers.common['Authorization'] = authString
  // axios.defaults.headers.common['CurrentUserId'] = "1"
  if(email){
    email = email.toLowerCase()
  }
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findUserByEmail?email='+encodeURIComponent(email))
    .then(response => {
      store.dispatch({type: 'user/userProfile', userProfile: response.data})
      sessionStorage.setItem('userId', response.data.userId);
      sessionStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    });
}

export function getUserById() {
  return axios.get('user/' + sessionStorage.userId)
    .then(response => {
      store.dispatch({type: 'user/userProfile', userProfile: response.data})
      //sessionStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    });
}

export function updateStoreWithCurrentUser(cognitoUser) {
  store.dispatch({type: 'user/user', user: cognitoUser})
}

export function getUserProfilePic(userId, pictureType) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/profilePicture/' + userId + "?UserPictureType=" + pictureType,{responseType: 'arraybuffer'}) // this lets axios know that response type is not JSON but binary data
    .then(response => {
      //let binaryImage = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      //let image = "data:image/png;base64," + image
      let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
      let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
      store.dispatch({type: 'user/userProfilePic', userProfilePic: image})
      return image;
    })
    .catch(response => {
      console.log("User does not have a profile picture yet")
      store.dispatch({type: 'user/userProfilePic', userProfilePic: undefined})
    })
}

export function saveUserProfilePic(data, userId, pictureType, userProfile) {
  //alert(data);
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'user/profilePicture', data)
    .then(response => {
      getUserById()
      return response.data
    }).catch(error => {
      throw(error);
    });
}

export function updateUser(formProps) {
  //console.log(formProps)
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'user', formProps)
    .then(response => {
      //store.dispatch({type: 'user/userId', userId: response.data.userId})
      // updateUserNotoficationPrefs(formProps.emailPref, formProps.pushPref)
      // .then(response => {
         return response.data;
      // })
    }).catch(error => {
      throw(error);
    });
}

export function deleteUserProfilePic() {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'user/profilePicture')
    .then(response => {
      return response.data;
    });
}

export function getUserNotoficationPrefs() {
  return axios.get('user/userNotificationPreferences')
    .then(response => {
      store.dispatch({type: 'user/userNotificationPrefs', userNotificationPrefs: response.data})
      return response.data;
    });
}

export function updateUserNotoficationPrefs(emailNotification, pushNotification) {
  if(emailNotification == "" || emailNotification == undefined){
    emailNotification = false
  }
  if(pushNotification == "" || pushNotification == undefined){
    pushNotification = false
  }
  var notificationPrefObj = {email: emailNotification, push: pushNotification};
  //console.log(notificationPrefObj);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'user/userNotificationPreferences', notificationPrefObj)
    .then(response => {
      return response.data;
    }).catch(error => {
      throw(error);
    });
}


export function leaveList(taskListId){
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'user/userLeavesList/'+taskListId)
  .then(response => {
    return response;
  }).catch(error => {
    throw(error);
  });
}

export function findOrgInviteByEmail(email){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findOrgInviteByEmail/', email)
  .then(response => {
    return response.data;
  }).catch(error => {
    throw(error);
  });
}

export function getAllSpecialties() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'reference/specialties')
    .then(response => {
      store.dispatch({type: 'reference/allSpecialties', allSpecialties: response.data})
      return response.data;
    });
}

export function getAllTitles() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'reference/titles')
    .then(response => {
      store.dispatch({type: 'reference/allTitles', allTitles: response.data})
      return response.data;
    });
}

export function performHealthCheck() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'healthcheck/echo')
    .then(response => {
        //console.log("ALL OK")
    }).catch(error => {
      //console.log(error) //Network Error
      //console.log(error.status) //undefined
      //console.log(error.response) //undefined
      if(error.response == undefined || error.response == null){// this means network error
          //console.log("NOT OK")
          throw error;
      }
    });
}

export function refreshAccessToken(email) {
  if(window.sessionStorage.getItem("EnterpriseUserFlag") == "true"){
    return new Promise((resolve, reject) => {
      try{
        var refreshToken = window.sessionStorage.getItem("SSO_REFRESHTOKEN")
        // var authData = "grant_type=refresh_token&refresh_token="+refreshToken+"&client_id="+clientId+"&client_secret="+clientSecret
        // return axios.post(authUrl+'/token', authData)
        var authData = "grant_type=refresh_token&refresh_token="+refreshToken
        return axios.post(cognitoAuthUrl+'/oauth2/token', authData)        
          .then(response => {
            console.log(JSON.stringify(response.data))
            var userRefreshToken = response.data.refresh_token;
            var userAccessToken = response.data.access_token;
            var userIDToken = response.data.id_token;
            console.log('sso access-token: '+userAccessToken)
            window.sessionStorage.setItem("EnterpriseUserFlag", true)
            window.sessionStorage.setItem("SSO_ACCESSTOKEN", userAccessToken)
            window.sessionStorage.setItem("SSO_IDTOKEN", userIDToken)
            window.sessionStorage.setItem("SSO_REFRESHTOKEN", userRefreshToken)
            resolve("success")
        });
      }catch(err){
        reject(err)
      }
    })
  }else{
    let cognitoUserData = {
      Username: email,
      Pool: userPool
    };

    var comp = this

    return new Promise((resolve, reject) => {
      var cognitoUser = new CognitoUser(cognitoUserData)
      cognitoUser.getSession(function (err, session) {
        if (err) {
            console.log("Couldn't get the session: " + err, err.stack);
            reject(err);
        }
        else {
            console.log("Session is " + session.isValid());
            //console.log("AccessToken: "+session.accessToken.jwtToken);
            var currentAccessToken = sessionStorage.getItem('accessToken');
            if(currentAccessToken != session.accessToken.jwtToken){
              //call an API to use new access token with axios
              comp.getUserByEmail(email, cognitoUser);
            }
            sessionStorage.setItem('accessToken', session.accessToken.jwtToken);
            resolve(session.isValid())
        }
      })
    })
  }
}

export function getAccessTokensByAuthCode(authCode) {
  console.log('getting access token from: '+authCode)
  return new Promise((resolve, reject) => {
    try{
      var cognitoAuthUrl = process.env.COGNITO_OAUTH_URL;
      //sets global header for axios
      // axios.defaults.headers.common['Authorization'] = authString
      var authData = "grant_type=authorization_code&code="+authCode
      return axios.post(cognitoAuthUrl+'/oauth2/token', authData)
        .then(response => {
          console.log(JSON.stringify(response.data))
          // Authorization: Bearer <access_token>
          var userRefreshToken = response.data.refresh_token;
          var userAccessToken = response.data.access_token;
          console.log('access-token: '+userAccessToken)
          axios.defaults.headers.common['Authorization'] = 'Bearer '+userAccessToken
          return axios.get(cognitoAuthUrl+'/oauth2/userInfo')
            .then(response => {
              console.log(JSON.stringify(response.data))
              getUserByEmailAndAccessToken(response.data.email, userAccessToken);
              window.sessionStorage.setItem("EnterpriseUserFlag", true)
              var cognitoUserData = {
                Username : response.data.email,
                Pool : userPoolAlternate
              };
              var cognitoUser = new CognitoUser(cognitoUserData)
              var refreshToken = new CognitoRefreshToken({RefreshToken: userRefreshToken});
              cognitoUser.refreshSession(refreshToken, (err, result) => {
                if (err) return reject(err)
                console.log(result)
                resolve("success")
              })
              //store.dispatch({type: 'user/user', user: response.data})
          });
      });
    }catch(err){
      reject(err)
    }
  })
}

export function getEnterpriseAccessTokensByAuthCode(authCode) {
  console.log('getting FHIR access token from: '+authCode)
  return new Promise((resolve, reject) => {
    try{
      // var authData = "grant_type=authorization_code&client_id="+clientId+"&client_secret="+clientSecret+"&code="+authCode+"&redirect_uri="+ssoRedirectUrl
      var authUrl = process.env.HEYDOC_SERVICES_BASE_URL+"oidc";
      var authData = "grant_type=authorization_code&code="+authCode
      return axios.post(authUrl+'/token', authData)
        .then(response => {
          console.log(JSON.stringify(response.data))
          var userRefreshToken = response.data.refresh_token;
          var userAccessToken = response.data.access_token;
          var email = response.data.profile;
          console.log('sso access-token: '+userAccessToken)
          window.sessionStorage.setItem("EnterpriseUserFlag", true)
          window.sessionStorage.setItem("SSO_ACCESSTOKEN", userAccessToken)
          window.sessionStorage.setItem("SSO_REFRESHTOKEN", userRefreshToken)
          window.sessionStorage.setItem("SSO_USEREMAIL", email)
          resolve("success")
      });
    }catch(err){
      reject(err)
    }
  })
}

